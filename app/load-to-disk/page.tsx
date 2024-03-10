'use client'
import {useFormState} from "react-dom";
import {YDiskError} from "@/services/typesYDisk";
import haveLoadFile from "@/server-actions/haveLoadFile";
import {useRef} from "react";
export default  function Page(){
    let ref = useRef(null)
    const initialState:YDiskError & {status:number} = { description: '', error: '',status:0 ,message:''};
    // @ts-ignore: Type error.
    let [state,dispatch] = useFormState(haveLoadFile,initialState)

    function onFormActive(values: FormData) {
        values.append('nameFile',ref.current.querySelector('input').value.split('\\').at(-1))
        dispatch(values)
    }

    return <form style={{position:"relative",left:'150px'}} ref={ref} action={onFormActive }>
        <label >
            {state.status === 201 && <p>файл загружен на диск </p>}
            {state.status === 202 && <p> файл принят сервером, но еще не был перенесен непосредственно в Яндекс Диск.</p>}
            {state.status === 412 && <p>при дозагрузке файла был передан неверный диапазон в заголовке</p>}
            {state.status === 500 || state.status === 503 && <p>файл загружен на диск </p>}
            {state.status === 507 && <p> для загрузки файла не хватает места на Диске пользователя.</p>}
            {state.message && <p>{state.message.replace('app:/','')}</p>}
            <input type="file"  required={true} name={'file'}/>
        </label>
        <input type="submit" value="test"/>
    </form>

}