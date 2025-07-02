import { CvRecord } from "../cv-record";
import { CvRepository } from "../storage/cv-repository"
import { ImageRepository } from "../storage/image-repository"
import { CvService } from "./cv-service";
import { getImages } from "./get-images";
import { saveAs } from 'file-saver'

export interface CvDownloadService {
    downloadCv(id: string): Promise<void>
    uploadCv(file: File): Promise<boolean>
}

type ImageTypes = {[imageId: string]: string}


export function createCvDownloadService(cvService: CvService, imageRepository: ImageRepository): CvDownloadService{
    return {
        async downloadCv(id) {
            const {default: JsZip} = await import('jszip');
            const cvRecord = await cvService.getCv(id);
            if(!cvRecord){
                return;
            }
            const images = [...getImages(cvRecord.cv)];
            const zip = new JsZip();
            const imageFolder = zip.folder('images')!
            const imageTypes: ImageTypes = {};
            for(const image of images){
                const imageRecord = await imageRepository.getImage(image.id);
                if(!imageRecord){
                    continue;
                }
                imageFolder.file(image.id, imageRecord.content);
                imageTypes[image.id] = imageRecord.content.type;
            }
            imageFolder.file('types.json', new Blob([JSON.stringify(imageTypes)], {type: 'application/json'}))
            const urlSafeName = encodeURIComponent(cvRecord.name);
            zip.file(`cv.json`, new Blob([JSON.stringify(cvRecord)], {type: 'application/json'}));
            const zipBlob = await zip.generateAsync({type: 'blob'});
            saveAs(zipBlob, `${urlSafeName}.zip`)
        },
        async uploadCv(file: File): Promise<boolean> {
            const {default: JsZip} = await import('jszip');
            const result = await JsZip.loadAsync(file);
            const files = result.file(/^[^\/]+$/);
            if(files.length !== 1){
                console.warn('Archive does not have exactly one file in the root');
                return false;
            }
            const jsonFile = files[0];
            if(jsonFile.name !== 'cv.json'){
                console.warn('Root file is not called \'cv.json\'');
                return false;
            }
            const folderObjects = result.folder(/^.*$/);
            if(folderObjects.length !== 1){
                console.warn('Archive does not have exactly one folder');
                return false;
            }
            const folderObject = folderObjects[0];
            if(folderObject.name !== 'images/'){
                console.warn('The folder is not named \'images\'', folderObject.name);
                return false;
            }
            const imagesFolder = result.folder('images');
            if(!imagesFolder){
                return false;
            }
            const imageTypesFile = imagesFolder.file('types.json');
            if(!imageTypesFile){
                console.warn('There is no file images/types.json');
                return false;
            }
            let imageTypes: ImageTypes;
            try {
                const imageTypesBlob = await imageTypesFile.async('blob');
                imageTypes = JSON.parse(await imageTypesBlob.text());
            } catch(e){
                console.warn(e);
                return false;
            }
            let cvRecord: CvRecord;
            try {
                const jsonBlob = await jsonFile.async('blob');
                cvRecord = JSON.parse(await jsonBlob.text());
            }catch(e){
                console.warn(e);
                return false;
            }
            await cvService.storeCv({name: cvRecord.name, cv: cvRecord.cv}, null);
            for(const cvImage of getImages(cvRecord.cv)){
                const exists = await imageRepository.hasImageById(cvImage.id);
                if(exists){
                    console.info(`Image '${cvImage.id}' already exists`);
                    continue;
                }
                const imageFile = imagesFolder.file(cvImage.id);
                if(!imageFile){
                    console.warn(`Could not find image file '${cvImage.id}'`);
                    continue;
                }
                const contentType = imageTypes[cvImage.id];
                if(!contentType){
                    console.warn(`Could not find content type for '${cvImage.id}'`);
                    continue;
                }
                const imageFileArrayBuffer = await imageFile.async('arraybuffer');
                const imageContent = new Blob([imageFileArrayBuffer], {type: contentType});
                await imageRepository.storeImage({id: cvImage.id, content: imageContent})
            }
            return true;
        }
    }
}