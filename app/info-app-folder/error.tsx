'use client' // Error components must be Client Components

import {useEffect, useState} from 'react'
import {Alert, Space} from "antd";
import {YDiskError} from "@/services/typesYDisk";

export  function ErrorComponent({error,onClose}:{error:YDiskError}){
    return   <Space direction="vertical" style={{ width: '100%' ,position:"absolute",top:0,left:0}}>
        {error.error &&
            <Alert
                message={error.message ? error.error: "Error"}
                description={error.description}
                type="error"
                closable
                onClose={onClose}
            />
        }
    </Space>
}
export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('aaaaaaaaaaaa',error)
    }, [error])

    return (
        <div>
            <h2>Something went wrong!</h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    )
}