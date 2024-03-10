//y0_AgAAAAAjKFd8AADLWwAAAAD7nXRcAABnEiC2XYpOgZfboWitfea6qTKzhQ
//"cloud_api:disk.app_folder", "cloud_api:disk.info"
import {
    AppInfo,
    CustomError, LinkDownLoadDisk,
    LinkLoadDisk, Resource,
    ResourceFile,
    ResourceFolder, ResourceLink,
    trackerStatus,
    YDiskError,
    YDiskInfo
} from "./typesYDisk";


const API_LINKS =  {

    /**
     * get
     */
    diskInfo : 'disk/',
    /**
     * get - get meta info
     * PATCH - add meta info
     */
    metaResource : 'disk/resources',
    /**
     * get
     */
    listAllFile : 'disk/resources/files',
    /**
     * get
     */
    lastLoadedFile : 'disk/resources/last-uploaded',
    /**
     * get
     */
    loadToDiskLink : 'disk/resources/upload',
    /**
     * get
     */
    downloadFileLink : 'disk/resources/download',
    /**
     *post
     */
    copy : 'disk/resources/copy',
    /**
     *post
     */
    move : 'disk/resources/move',
    /**
     *delete
     */
    delete : 'disk/resources',
    /**
     * put
     */
    createFolder : 'disk/resources',
    /**
     * put
     */
    publicationResource : 'disk/resources/publish',
    /**
     * get
     */
    publishedMetaInfo : 'disk/public/resources',
    /**
     * get
     */
    listPublicationResource : 'disk/resources/public',

    /**
     * 'disk/operations/<идентификатор операции>'
     */
    operationsStatus : 'disk/operations/'
}


/**
 * @param {string} client_id
 *@description полуение информации о приложении или ошибки доступа к нему
 * @description использовать через прокси amocrm
 */
export async function getAppInfo(client_id:string):Promise<any>{
    let [appInfo,error] = await fetch(`https://oauth.yandex.ru/client/${client_id}/info`,{
        headers:{'Content-Type':'application/json;',CORS :'Access-Control-Allow-Origin' }
    }).then(async response=>{
                if(response.ok){
                    return  await response.json().then(info=>[info,null])
                }
                return [null,response.status]
            }
        )
    if(error !==null){
        return error
    }
    return appInfo
}

/**
 * @description проверка наличие у приложения нужных разрешения для работы с yandex disk
 * @param {Object} info
 * @return {boolean}
 */
export function isHaveScopeYDist(info:AppInfo){
    return !!info?.scope  && 'cloud_api:disk.app_folder' in  info.scope && 'cloud_api:disk.info' in info.scope
}
/**
 *@description получение ссылки для ацетификации yandex
 * @param {string} client_id
 * @return {string}
 */
export function getAuthorizationLink(client_id:string):string{
    return'https://oauth.yandex.ru/authorize?response_type=code' +
        `&client_id=${client_id}`+
        '&force_confirm=yes'
}

export function getAuthTestToken(client_id:string):string{
    return `https://oauth.yandex.ru/authorize?response_type=token&client_id=${client_id}`
}


/**
 * @
 * @param authorization_code для получения нужно авторезирваться по переходу по ссылке
 * полученной getAuthorizationLink
 * @param {string} client_id
 * @see getAuthorizationLink
 * @description нужен прокси
 * @return {Promise<{error:null|{},info:info|null}>}
 */
export async function getOAuthKeys(authorization_code:string,client_id:string):Promise<any> {
    let error: YDiskError | null = null
    let info: AppInfo | null  = null
    //@ts-ignore
    let headers: Headers = new Headers();
    let initBody = JSON.stringify({
        'grant_type':'authorization_code',
        'code':`${authorization_code}`,
    })
    headers.set('Content-type','application/x-www-form-urlencoded')
    await fetch('https://oauth.yandex.ru/',{
        method:'POST',
        headers: headers ,
        body:initBody
    }).then(response=>{
        response.json().then((data:any)=>{
            if(response.ok){
                error = null
                info = data
                return
            }
            // @ts-ignore
            error = info
            info = null
        })
    })

    return {'error':error,'info':info}
}

interface interfaceDisk{
    /*+*/infoDisk():Promise<any>
    /*+*/statusAsyncOperation(idOperation):Promise<undefined | {status:string,statusCode:number}>
    infoFile(path:string,options: any ):Promise<ResourceFile|undefined>
    infoFolder(path:string,options: any ):Promise<ResourceFolder|undefined>
    /*+*/listAllFile(options:{ limit?:number, media_type?:string, offset?:number, fields?:any, preview_size?:number, preview_crop?:string }):Promise<{items:Array<ResourceFile>|undefined}>
    getDownloadFileLink(path:string):Promise<LinkDownLoadDisk|undefined>
    addMetaInfo():Promise<any>
    /*+*/loadToDisk(loadingLing:string,file :File):Promise<{status:number}|undefined>
    /*+*/copyResource(from:string,to:string,options:{overwrite?:boolean}):Promise<trackerStatus|ResourceLink|undefined>
    /*+*/moveResource(from:string,to:string,options:{overwrite?:boolean}):Promise<trackerStatus|ResourceLink|undefined>
    /*+*/delFileOrFolder(path:string,options:{permanently?:boolean}):Promise<trackerStatus|{status:number}|undefined>
    /*+*/createFolder(path:string,options:{overwrite?:boolean}):Promise<trackerStatus|{status:number}|undefined>

}


export default class YandexDiskApi implements interfaceDisk {
    private static singleton: YandexDiskApi | null;

    protected HOST = 'cloud-api.yandex.net'
    protected versionApi = 'v1'

    _fieldFolder = JSON.stringify('name,_embedded,_embedded.items.path,_embedded.items.type,created,custom_properties,public_url,origin_path,modified,path,md5,type,mime_type,size')

    publication(){}
    listPublicated(){}

    /**
     * @description
     * media_type - Тип файлов, которые нужно включить в список. Чтобы запросить несколько типов файлов, можно перечислить их в значении параметра через запятую.
     *@description
     * offset - Количество ресурсов с начала списка, которые следует опустить в ответе
     * @description
     * fields - Список свойств JSON, которые следует включить в ответ. пример name,_embedded.items.path
     * @description
     * preview_size - Требуемый размер уменьшенного изображения.
     * @description
     * preview_crop - Параметр позволяет обрезать превью согласно размеру, заданному в значении параметра preview_size.
     *
     * @param {
     * {
     *         limit?:number,
     *         media_type?:string,
     *         offset?:number,
     *         fields?:any,
     *         preview_size?:number,
     *         preview_crop?:string
     *         }
     *         } options
     */
    async listAllFile(options:{
        limit?:number,
        media_type?:string,
        offset?:number,
        fields?:any,
        preview_size?:number,
        preview_crop?:string
    }={limit:20}):Promise<{items:Array<ResourceFile>}|undefined>{
        let urlParams = new URLSearchParams()
        Object.entries(options).map((item)=>{
            urlParams.append(item[0],item[1])
        })
        return this._fetch(API_LINKS.listAllFile+'?'+urlParams.toString())
            .then(async (response)=>{
                if(response){
                    return await response.json().then((data)=>{
                        return data
                    })
                }
                return
            })
    }

    /**
     * @description
     * Статус операции. Возможные значения:
     * success — операция успешно завершена.
     * @description
     * failed — операцию совершить не удалось, попробуйте повторить изначальный запрос копирования, перемещения или удаления.
     * @description
     * in-progress — операция начата, но еще не завершена.
     * @param {string} idOperation
     */
    async statusAsyncOperation(idOperation):Promise<undefined | {status:string,statusCode:number}>{
        return this._fetch(`disk/operations/${idOperation.split('/').at(-1)}`)
            .then(async (response)=>{
            if(response){
                return  await response.json()
                    .then((starusOperation)=>{
                        starusOperation.statusCode = response.status
                    return starusOperation
                })
            }
            return
        })
    }

    /**
     * @description возвращает Promise если не было ошибок иначе undefined.
     * ошибку можно получить через Promise.catch
     * @param {string} apiUrl see API_LINKS
     * @param {string} method
     * @return {Promise<Response|undefined>}
     */
    _fetch(apiUrl:string,method="GET"):Promise<Response|undefined>{
        return fetch(`https:${this.HOST}/${(this.versionApi)}/${apiUrl}`,{
            method:method,
            headers:{Authorization:` OAuth ${this._OAuthKey}`,'Content-Type':'application/json'}
        }).then(async (response:Response)=>{
            if(response.ok){
                return response
            }
            await response.json().then((data:YDiskError)=>{
               return Promise.reject(data)
            })
        })
    }

    constructor(private _OAuthKey: string) {
        if(YandexDiskApi.singleton){
            YandexDiskApi.singleton = this
        }
        return YandexDiskApi.singleton
    }

    /**
     *
     * @return {Promise<YDiskInfo>}
     * @example
     * Promise
     * {
     *   "trash_size": 4631577437,
     *   "total_space": 319975063552,
     *   "used_space": 26157681270,
     *   "system_folders":
     *   {
     *     "applications": "disk:/Приложения",
     *     "downloads": "disk:/Загрузки/"
     *   }
     * }
     */
    async infoDisk():Promise<YDiskInfo|undefined> {
      return  this._fetch('disk/').then( async (response)=>{
            if(response && response.ok){
                return await response.json().then((info:YDiskInfo)=>{
                    return info
                })
            }
            return undefined
      })
    }

    /**
     *
     * @param path путь до папки или файла
     * @param {{limit:{number},sort:'modified'|'name'|'path'|'created'}} options
     * @description  options.limit количество ресурсов для вывода @default 20
     * @return Promise<ResourceFile|ResourceFolder|undefined>
     *
     */
    async _infoFileFolder(path:string,options={limit:20, sort: 'name'}):Promise<ResourceFile|ResourceFolder|undefined>{
        let urlParams = new URLSearchParams()
        urlParams.append('limit',options.limit.toString())
        urlParams.append('sort',options.sort)
        urlParams.append('fields',this._fieldFolder)
        return   this._fetch(`disk/resources?path=app:/${path}&`+
            urlParams.toString())
           .then(async (response:Response|undefined)=>{
            if(response){
              return  await response.json()
                   .then((data:ResourceFile|ResourceFolder)=>{
                    return data
                })
            }
               return undefined
       })
    }

    /**
     * @description wrapp for _infoFileFolder
     * @see _infoFileFolder
     * @param path
     * @param options
     * @return Promise<ResourceFile|undefined>
     */
    async infoFile(path:string,options={limit:20, sort: 'name'}):Promise<ResourceFile|undefined>{
       return  this._infoFileFolder(path ,options)
           .then(async (resource)=>{
            if(resource && resource.type ==='file'){
                return resource
            }
            if(resource){
                await Promise.reject(() => {
                    return {
                        "description": 'this is a not file',
                        "error": 'typeError'
                    }
                })
            }

           return
        })

    }

    /**
     * @description предоставляет информацию о папке приложения
     * @return Promise<ResourceFolder|undefined>
     */
    async infoAppFolder():Promise<ResourceFolder|undefined>{
        let urlParams = new URLSearchParams()
        urlParams.append('path','app:/')
        urlParams.append('fields',this._fieldFolder)
       return  this._fetch(`disk/resources?`+urlParams.toString())
           .then(async (response:Response|undefined)=>{
           if(response?.ok){
             return   await response.json()
                   .then((data:ResourceFolder)=>{
                       return data
                   })
           }
               return undefined
       })
    }
    /**
     * @description wrapp for _infoFileFolder
     * @see _infoFileFolder
     * @param path
     * @param options
     * @return Promise<ResourceFolder|undefined>
     */
    async infoFolder(path:string,options={limit:20, sort: 'name'}):Promise<ResourceFolder|undefined>{
        return this._infoFileFolder(path ,options).then(async (resource)=>{
            if(resource && resource.type === 'dir'){
                return resource
            }
            if(resource){
                await   Promise.reject({
                    "description": 'this is a not folder',
                    "error": 'typeError'} )
            }
            return
        })

    }
    /**
     *
     * @param {string} path путь, по которому следует загрузить файл
     * @param {{overwrite?:boolean}} options разрешение на перезапись @default false
     * @description overwrite @default false разрешение на перезапись существующего файла
     * @return {Promise<LinkLoadDisk|undefined>}
     * @example
     * if error
     * {
     *   "description": "resource already exists",
     *   "error": "PlatformResourceAlreadyExists"
     * }
     * resource already exists.
     * take this into account.
     */
    async getLoadingLink(path:string,options:{overwrite?:boolean}={}):Promise<LinkLoadDisk|undefined>{
        let url = new URLSearchParams()
        url.append('path','app:/'+path)
        url.append('overwrite','false')
        return  this._fetch('disk/resources/upload'+
            `?${url.toString()}`
        ).then(async (response)=>{
            if(response?.ok){
                return await response.json().then((data:LinkLoadDisk)=>{
                    return data
                })
            }
            return
        })
    }
    /**
     * @param {string} loadingLing ссылка полученная @see getLoadingLink
     * @param {File} file
     * @description
     * list status.
     * 202 Accepted — файл принят сервером, но еще не был перенесен непосредственно в Яндекс Диск.
     *
     * 412 Precondition Failed — при дозагрузке файла был передан неверный диапазон в заголовке Content-Range.
     *
     * 413 Payload Too Large — размер файла больше допустимого. Если у вас есть подписка на Яндекс 360, можно загружать файлы размером до 50 ГБ, если подписки нет — до 1 ГБ.
     *
     * 500 Internal Server Error или 503 Service Unavailable — ошибка сервера, попробуйте повторить загрузку.
     *
     * 507 Insufficient Storage — для загрузки файла не хватает места на Диске пользователя.
     */
    async loadToDisk(loadingLing:string,file :File):Promise<{status:number}|undefined>{

        return fetch(loadingLing,{
            method:'PUT',
            body:await file.arrayBuffer(),
            headers:{"Content-Type":"application/x-www-form-urlencoded"}
        })
            .then( async (respnse)=>{
            if(respnse.ok){
                return {status:respnse.status}
            }
            await Promise.reject(({status:respnse.status}))
            return undefined
        })
    }

    async loadToDiskOverUrl(url:string,pathIntoDisk:string):Promise<trackerStatus|undefined>{
        let urlParams = new URLSearchParams()
        urlParams.append('url',url)
        urlParams.append('path',pathIntoDisk)
        urlParams.append('disable_redirects',true+'')
        return fetch(`${this.HOST}/${this.versionApi}/disk/resources/upload?`+urlParams.toString())
            .then( async (response)=>{
                let dataResponse = await response.json().then((data:trackerStatus)=>{
                    return data
                })
                if(response.ok){
                   return dataResponse
                }
                await Promise.reject(dataResponse)
                return  undefined
            } )
    }

    /**
     *
     * @param {string} path
     */
    async getDownloadFileLink(path:string):Promise<LinkDownLoadDisk|undefined>{
        let urlParams = new URLSearchParams()
        urlParams.append('path',path)
        return this._fetch('disk/resources/download?'+ urlParams.toString())
            .then(async (response)=>{
                if(response){
                   return await response.json().then((data:LinkDownLoadDisk)=>{
                        return data
                    })
                }
                return undefined
            })
    }


    async _operationOnFileOrFolder(operationURL:string,method:string,from:string,to:string,options:{overwrite?:boolean}):Promise<trackerStatus|ResourceLink|undefined>{
        let urlParams = new URLSearchParams()
        urlParams.append('from',from)
        urlParams.append('path',to)
        urlParams.append('overwrite',options?.overwrite ? options?.overwrite+'' : false+'')
        return this._fetch(operationURL+'?'+urlParams.toString(),method)
            .then(async (response)=>{
                if(response){
                    return await response.json().then((data:trackerStatus|ResourceLink)=>{
                        data.status = response.status
                        return data
                    })
                }
                return undefined
            })
    }

    /**
     * @description
     * list status.
     * 202 - Accepted (копирование начато)
     * 201 - Created (ресурс успешно скопирован)
     * + error status
     * @param {string} from Путь к копируемому ресурсу.
     * @param {string} to Путь к создаваемой копии ресурса.
     * @param {{overwrite?:boolean}} options
     * @default false
     * Признак перезаписи. Учитывается, если ресурс копируется в папку, в которой уже есть ресурс с таким именем.
     * false — отменить копирование и не перезаписывать файлы.
     * true — копировать, удаляя имеющиеся файлы с совпадающими именами.
     */
    async copyResource(from:string,to:string,options:{overwrite?:boolean} = {overwrite:false}):Promise<trackerStatus|ResourceLink|undefined>{
        return this._operationOnFileOrFolder(API_LINKS.copy,'POST',from,to,options)
    }
    /**
     * @description
     * list status.
     * 202 - Accepted (перемещение начато)
     * 201 - Created (ресурс успешно перемещён)
     * + error status
     * @param {string} from Путь к перемещаемому ресурсу.
     * @param {string} to Путь к точке назначение ресурса.
     * @param {{overwrite?:boolean}} options
     * @default false
     * Признак перезаписи. Учитывается, если ресурс перемещается в папку, в которой уже есть ресурс с таким именем.
     * false — отменить действие.
     * true — перемещать, удаляя имеющиеся файлы с совпадающими именами.
     */
    async moveResource(from:string,to:string,options:{overwrite?:boolean}= {overwrite:false}):Promise<trackerStatus|ResourceLink|undefined>{
        return this._operationOnFileOrFolder(API_LINKS.move,'POST',from,to,options)
    }


    /**
     *
     * @param {string } path Путь к удаляемому ресурсу.
     * @param {{permanently?:boolean}} options
     * @description permanently - Признак безвозвратного удаления.
     * @description false — удаляемый файл или папка перемещаются в Корзину (используется по умолчанию).
     * @description true — файл или папка удаляются без помещения в Корзину.
     * @description status list
     * @description 204 No content (ресурс успешно удален) без тела ответа
     * @description 202 Accepted (удаление папки начато) - нужно отслеживать
     *@return Promise<trackerStatus|{status:number}|undefined
     */
    async delFileOrFolder(path:string,options:{permanently?:boolean} = {}):Promise<trackerStatus|{status:number}|undefined>{
        let urlParams = new URLSearchParams()
        urlParams.append('path',path)
        urlParams.append('overwrite',options?.permanently ? options?.permanently+'' : false+'')
        return this._fetch(API_LINKS.delete+'?'+urlParams.toString(),'DELETE')
            .then(async (response)=>{
                if(response){
                    if(response.body){
                        return await response.json().then((data:trackerStatus|ResourceLink)=>{
                            data.status = response.status
                            return data
                        })
                    }
                    return {status:response.status}

                }
                return undefined
            })
    }


    /**
     * @description создаёт папку в папке приложения
     * @param {string} path Путь к создаваемой папке.
     */
    async createFolder(path:string):Promise<trackerStatus|{status:number}|undefined>{
        let urlParams = new URLSearchParams()
        urlParams.append('path','app:/'+path)
        return this._fetch(API_LINKS.createFolder+'?'+urlParams.toString(),'PUT')
            .then(async (response)=>{
                if(response){
                   return  await response.json().then((data:trackerStatus|ResourceLink)=>{
                        data.status = response.status
                        return data
                    })
                }
                return undefined
            })
    }




}