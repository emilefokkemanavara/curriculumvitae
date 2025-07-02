import { Image } from 'curriculumvitae-schemas';

const imageType: Image['type'] = 'curriculum://vitae/schemas/types/image'

export function *getImages(value: unknown): Iterable<Image> {
    if(!value || typeof value !== 'object'){
        return;
    }
    if('type' in value && value.type === imageType){
        if(!('id' in value) || typeof value.id !== 'string'){
            return;
        }
        yield value as Image;
        return;
    }
    for(const [_, propValue] of Object.entries(value)){
        yield* getImages(propValue)
    }
}