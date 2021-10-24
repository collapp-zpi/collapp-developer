import { DropzoneRootProps, useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { useController } from 'react-hook-form'
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
  PointerEvent as ReactPointerEvent,
} from 'react'
import Modal from 'shared/components/Modal'
import Button from 'shared/components/button/Button'
import styled from 'styled-components'
import { PureInputRange } from 'shared/components/input/InputRange'

type InputPhotoChildrenProps = {
  invalid: boolean
  isDragAccept: boolean
  open: () => void
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T
  value: string
  onChange: (value?: string) => void
}

type InputPhotoProps = {
  name: string
  children: (args: InputPhotoChildrenProps) => ReactNode
}

export const InputPhoto = ({ name, children }: InputPhotoProps) => {
  const [file, setFile] = useState<File | null>(null)
  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController({ name })

  const { getRootProps, getInputProps, isDragAccept, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    // disabled: fileMessage,
    onDropAccepted: (files) => {
      if (!files?.[0]) return
      setFile(files[0])
    },
    onDropRejected: () => {
      toast.error('There was an error while attempting to upload a photo.')
    },
    maxSize: 5 * 1048576, // 5 * 1MB
    accept: ['image/png', 'image/jpeg'],
  })

  const handleSave = (image: string) => {
    onChange(image)
    setFile(null)
  }

  return (
    <>
      <input {...getInputProps()} />
      {children({ invalid, isDragAccept, getRootProps, open, value, onChange })}
      <InputPhotoModal
        value={file}
        close={() => setFile(null)}
        onSave={handleSave}
      />
    </>
  )
}

const CutoffContainer = styled.div`
  width: 192px;
  height: 192px;
`

const CutoffFront = styled.div`
  border-radius: 25%;
  pointer-events: none;
  box-shadow: 0 0 0 1000rem #fffa;
`

const MAX_SIZE = 192

type InputPhotoModalProps = {
  value: File | null
  close: () => void
  onSave: (image: string) => void
}

const InputPhotoModal = ({ value, close, onSave }: InputPhotoModalProps) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>()
  const [scale, setScale] = useState(0.5)
  const [isGrabbing, setIsGrabbing] = useState(false)
  const [{ translateX, translateY }, setTransform] = useState({
    translateX: 0,
    translateY: 0,
  })

  const handleCanvasRef = useCallback(setCanvas, [setCanvas])

  useEffect(() => {
    if (!canvas) return
    if (!value) return

    const src = URL.createObjectURL(value)

    const img = new Image()
    img.src = src
    // setState({
    //   isLoading: true,
    // })

    img.onload = () => {
      const scale =
        (MAX_SIZE * 2) / (img.width < img.height ? img.width : img.height)

      canvas.width = Math.floor(img.width * scale)
      canvas.height = Math.floor(img.height * scale)

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      setScale(0.5)
      setTransform({
        translateX: (MAX_SIZE * 2 - canvas.width) / 2,
        translateY: (MAX_SIZE * 2 - canvas.height) / 2,
      })
    }

    return () => {
      // Make sure to revoke the data uris to avoid memory leaks
      URL.revokeObjectURL(src)
    }
  }, [value, canvas])

  const handlePointerDown = (startEvent: ReactPointerEvent<HTMLDivElement>) => {
    startEvent.stopPropagation()
    startEvent.preventDefault()
    if (!canvas) return
    const startX = startEvent.clientX
    const startY = startEvent.clientY
    const startTranslateX = translateX
    const startTranslateY = translateY
    const width = canvas.width
    const height = canvas.height
    setIsGrabbing(true)

    const handlePointerMove = (e: PointerEvent) => {
      e.stopPropagation()
      e.preventDefault()
      const { clientX, clientY } = e
      if (!canvas) return

      setTransform({
        translateX: Math.max(
          Math.min(startTranslateX + (clientX - startX) / scale, 0),
          MAX_SIZE / scale - width,
        ),
        translateY: Math.max(
          Math.min(startTranslateY + (clientY - startY) / scale, 0),
          MAX_SIZE / scale - height,
        ),
      })
    }

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener(
      'pointerup',
      (e) => {
        e.stopPropagation()
        e.preventDefault()
        document.removeEventListener('pointermove', handlePointerMove)
        setIsGrabbing(false)
      },
      { once: true },
    )
  }

  const handleSetScale = (scale: number) => {
    if (!canvas) return
    setTransform({
      translateX: Math.max(
        Math.min(translateX, 0),
        MAX_SIZE / scale - canvas.width,
      ),
      translateY: Math.max(
        Math.min(translateY, 0),
        MAX_SIZE / scale - canvas.height,
      ),
    })
    setScale(scale)
  }

  const handleSave = () => {
    if (!canvas) return
    const newCanvas = document.createElement('canvas')
    newCanvas.width = MAX_SIZE
    newCanvas.height = MAX_SIZE

    const ctx = newCanvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(
      canvas,
      -translateX,
      -translateY,
      MAX_SIZE / scale,
      MAX_SIZE / scale,
      0,
      0,
      MAX_SIZE,
      MAX_SIZE,
    )

    const uri = newCanvas.toDataURL('image/jpeg')
    onSave(uri)
  }

  return (
    <Modal visible={!!value}>
      <div className="p-8 overflow-hidden" onPointerDown={handlePointerDown}>
        <CutoffContainer className="relative">
          <canvas
            ref={(ref) => handleCanvasRef(ref ?? undefined)}
            className="absolute left-0 top-0"
            style={{
              transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
              transformOrigin: 'left top',
              cursor: isGrabbing ? 'grabbing' : 'grab',
            }}
          />
          <CutoffFront className="absolute left-0 top-o w-full h-full border-2" />
        </CutoffContainer>
      </div>
      <PureInputRange
        value={scale}
        onChange={handleSetScale}
        max={2}
        min={0.5}
        step={0.1}
      />
      <div className="flex">
        <Button color="light" className="mr-auto" onClick={close}>
          Cancel
        </Button>
        <Button color="blue" className="ml-2" onClick={handleSave}>
          Save
        </Button>
      </div>
    </Modal>
  )
}
