
export type AppInfo ={
    "id": string,
    "name": string,
    "ctime": number,
    "mtime": number,
    "icon":string| null,
    "homepage": string,
    "callback": string,
    "description": "",
    "scope":  Array<string>,
    "localized_names":
        {
            "ru"?: string,
            "en"?: string,
            "tr"?: string,
            "uk"?: string,
            "ar"?: string,
            "he"?: string
        },
    "localized_scope": Array<string>,
    "is_yandex": boolean}

export type YDiskError = {
    "description": string,
    "error": string,
    "message"?:string
}
export type CustomError = YDiskError


export type YDiskInfo = {

    /**
     * объём данных в корзине
     */
    "trash_size": number,
    /**
     * Общий объем Диска, доступный пользователю, в байтах.
     */
    "total_space": number,
    /**
     * Объем файлов, уже хранящихся на Диске, в байтах.
     */
    "used_space": number,
    "system_folders":
        {
            [key: string]: string,
        }
}

export type LinkDownLoadDisk = LinkLoadDisk
export type Resource = {
    "public_key": string,
    "public_url": string,
    "name": string,
    "created": string,
    "custom_properties": { [key: string]: any,},
    "origin_path": string,
    "modified": string,
    "path": string,
    "md5": string,
    "type": 'dir'|'file',
    "mime_type": string,
    "size": number
}

export type ResourceList = {
    "sort": string,
    "public_key": string,
    "items":Array<Resource>,
    "path": string,
    "limit": number,
    "offset": number,
    "total": number
}

export type ResourceFolder = Resource & {
    "_embedded"?: ResourceList,
    "type": "dir"
}
export type ResourceFile = Resource & {
    "type": "file"
}
export type LinkLoadDisk = {
    "href": string,
    "method": string,
    "templated": boolean
}
export type trackerStatus = LinkLoadDisk & {
    'status':number,
}
export type ResourceLink = trackerStatus




