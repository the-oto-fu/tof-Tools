import { useState, useEffect, useRef } from "react";
import { Button, Icon, Segment, Header } from 'semantic-ui-react'
import { useDropzone } from 'react-dropzone'
import Camera from './Camera'
import { OpacityMotion } from '../utilities/Motion'

let reader = new FileReader();

type propsType = {
    liftUpImageFile: (newImageFile: string) => void,
    liftUpScreenError: (error: Error) => void
};

function UploadImage(props: propsType) {

    const [isCameraOn, setIsCameraOn] = useState(false);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

    //引数のblob画像をデータURL形式にしてStateにセットする
    const ReadImageAsURL = async (imageFile: File) => {
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
            if (typeof reader.result === "string") {
                props.liftUpImageFile(reader.result);
            };
        }
    }

    useEffect(() => {
        if (acceptedFiles.length) {
            ReadImageAsURL(acceptedFiles[0]);
        }
    }, [acceptedFiles])

    const imagePaste = (e: ClipboardEvent) => {
        if (e.clipboardData == null) {
            return
        }
        let items = Array.from(e.clipboardData.items);
        let item = items.find(x => /^image\//.test(x.type));
        if (item) {
            let image = item.getAsFile();
            if (image) {
                ReadImageAsURL(image);
            }
            document.removeEventListener("paste", imagePaste);
        }
    }

    useEffect(() => {
        //画面に対するペーストのイベント
        document.addEventListener("paste", imagePaste);

        //useEffect内で関数をreturnしたものはクリーンアップ関数になる 
        //React はコンポーネントがアンマウントされるときにクリーンアップを実行する。
        //ひとつ前のレンダーによる副作用を、次回の副作用を実行する前にもクリーンアップする。
        return () => {
            document.removeEventListener("paste", imagePaste);
        }
    }, []);

    const cameraOn = (e: React.SyntheticEvent<HTMLElement>) => {
        e.stopPropagation()
        setIsCameraOn(true);
    }

    const cameraOff = () => {
        setIsCameraOn(false);
    }

    const handleChangeImageFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files == null) {
            return
        }
        ReadImageAsURL(e.target.files[0]);
        document.removeEventListener("paste", imagePaste);
    }

    const imageFileinputRef = useRef<HTMLInputElement>(null);

    const handleClickImageSelect = () => {
        if (imageFileinputRef.current) {
            imageFileinputRef.current.click();
        }
    }

    return (
        <>
            {isCameraOn ?
                <Camera
                    liftUpImageFile={(imagefile) => props.liftUpImageFile(imagefile)}
                    cameraOff={() => cameraOff()}
                    liftUpScreenError={(error) => props.liftUpScreenError(error)}
                />
                : null
            }

            <OpacityMotion>
                <div {...getRootProps({ className: 'dropzone' })} onClick={(e) => e.stopPropagation()}>
                    <input
                        {...getInputProps()}
                        type="file"
                        id="inputfile"
                        accept=".png,.jpg,.jpeg"
                        ref={imageFileinputRef}
                        onChange={(e) => handleChangeImageFileInput(e)}
                    />
                    <Segment placeholder onClick={handleClickImageSelect}>
                        <Header icon>
                            <Icon name='cloud upload' />
                            地図画像をアップロード
                        </Header>
                        キャプチャ画像をそのままCtrl + VしてもOK!
                        <div className="from-camera-button">
                            <Button onClick={cameraOn} ><Icon name='camera' />カメラから(スマホ向け)</Button>
                        </div>
                    </Segment>
                </div>
            </OpacityMotion>
        </>
    )
}

export default UploadImage