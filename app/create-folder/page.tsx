'use client'
import {Button, Form, Input, Name} from 'antd';
import {useFormState} from "react-dom";
import type {ErrorState} from "@/server-actions/types";
import createFolder from "@/server-actions/y-resource-actionce/createFolder";
import {useRef} from "react";


export default function Page(){
    const initialState:ErrorState = { description: '', error: '',status:0 ,message:''};
    // @ts-ignore: Type error.
    let [state,dispatch] = useFormState(createFolder,initialState)
    let ref = useRef(null)
    function onFormFinish(values: any) {

        dispatch(values)
    }

    return <Form ref={ref}
                 style={{background:"white",borderRadius:10,padding:10}}
                 layout='vertical'
                 name={'create-file'}
                 autoComplete={'off'}
                 onFinish={onFormFinish}
    >
        <Form.ErrorList helpStatus={"error"} errors={[state?.message ? state.message:null]}/>
        <Form.ErrorList helpStatus={"success"} errors={[state?.status < 400 ? state.description:null]}/>
        <Form.Item rules={[ { required: true }]}
                   label={'name of new folder'}
                   name={'folder-name'}>
            <Input />
        </Form.Item>
        <Form.Item>
            <Button type="default"  htmlType="submit">
                Submit
            </Button>
        </Form.Item>

    </Form>
}