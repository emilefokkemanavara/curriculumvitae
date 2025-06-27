import { createDb } from "./util/create-db";
import { DbStore, DbStoreIndex } from "./util/types";

export interface CvDb {
    cvs: DbStore & {
        indexes: {
            name: DbStoreIndex
        }
    },
    images: DbStore
}

export function createCvDb(): CvDb{
    return createDb('curriculumvitae', {
        cvs: {
            keyPath: 'id',
            indexes: {
                name: {
                    keyPath: 'name'
                }
            }
        },
        images: {
            keyPath: 'id'
        }
    });
}