import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import classNames from 'classnames'
import { FiUploadCloud } from 'react-icons/fi'
import Button from 'shared/components/button/Button'
import { BsFileEarmarkZip } from 'react-icons/bs'
import dayjs from 'dayjs'
import { CgSoftwareDownload, CgSpinner } from 'react-icons/cg'
import useRequest, { RequestState } from 'shared/hooks/useRequest'
import { updatePluginFile } from 'includes/plugins/endpoints'

export const parseFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (
    (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i]
  )
}

type PluginFileFormProps = {
  id: string
  file: any
}

export const PluginFileForm = ({ id, file }: PluginFileFormProps) => {
  const [innerFile, setInnerFile] = useState<File | undefined | null>()

  const fileRequest = useRequest(updatePluginFile(id), {
    onSuccess: () => {
      toast.success('The source code has been updated successfully.')
    },
    onError: ({ message }) => {
      toast.error(
        `There has been an error while updating the source code. ${
          !!message && `(${message})`
        }`,
      )
    },
  })

  const isLoading = fileRequest.status === RequestState.Loading

  const { getRootProps, getInputProps, isDragAccept, isDragReject, open } =
    useDropzone({
      noClick: true,
      noKeyboard: true,
      multiple: false,
      disabled: isLoading,
      onDropAccepted: (files) => {
        if (!files?.[0]) return
        console.log(files[0])
        setInnerFile(files[0])
      },
      onDropRejected: () => {
        toast.error('There was an error while attempting to upload the file.')
      },
      maxSize: 5 * 2 ** 20, // 5 * 1MB
      accept:
        'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip',
    })

  if (innerFile || (file && innerFile === undefined)) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="flex items-center justify-center py-2 pr-3 text-gray-400">
            <BsFileEarmarkZip size="2rem" />
          </div>
          <div className="flex flex-col mr-auto">
            <div className="font-bold">{(innerFile || file).name}</div>
            <div className="text-sm">
              {dayjs((innerFile || file).lastModifiedDate).format('LLL')}
            </div>
            <div className="text-sm text-gray-400">
              {parseFileSize((innerFile || file).size)}
            </div>
          </div>
          {file && innerFile === undefined && (
            <Button
              hasIcon
              color="light"
              onClick={() => console.log(file?.url)}
            >
              <CgSoftwareDownload size="1.5rem" />
            </Button>
          )}
        </div>

        <div className="flex mt-4">
          <Button
            color="light"
            className="ml-auto"
            onClick={() => setInnerFile(null)}
            disabled={isLoading}
          >
            Choose a different file
          </Button>
          {innerFile && (
            <Button
              className="ml-2"
              onClick={() => fileRequest.send(innerFile)}
            >
              {isLoading && <CgSpinner className="animate-spin mr-2 -ml-2" />}
              Submit
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div
        {...getRootProps()}
        className={classNames(
          'bg-gray-50 transition-all border-dashed outline-none border-4 rounded-xl flex flex-col items-center justify-center mb-4 text-sm text-gray-500 p-8 text-center',
          isDragReject
            ? 'border-red-500'
            : isDragAccept
            ? 'border-green-500'
            : 'border-gray-300 focus-within:border-blue-500',
        )}
      >
        <input {...getInputProps()} />
        <FiUploadCloud size="4em" />
        <span className="mt-3 font-bold text-lg">
          Drag and drop the file here
        </span>
        <span className="text-gray-400 mt-1 mb-2">or</span>
        <Button color="light" onClick={open}>
          Browse
        </Button>
      </div>
      <div className="flex justify-between text-gray-400 text-sm">
        <span>Accepted extensions: zip</span>
        <span>Maximum size: 5MB</span>
      </div>
    </div>
  )
}
