import { useState, useEffect, useRef } from "react";
import { Button, Icon, Segment, Header } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Camera from './Camera'

let reader = new FileReader();

function UploadImage(props) {

    const [isCameraOn, setIsCameraOn] = useState(false);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

    useEffect(() => {
        if (acceptedFiles.length) {
            ReadImageAsURL(acceptedFiles[0]);
        }
    }, [acceptedFiles])

    
    const imagePaste = (e) => {
        let items = Array.from(e.clipboardData.items);
        let item = items.find(x => /^image\//.test(x.type));
        if (item) {
            let image = item.getAsFile();
            ReadImageAsURL(image);
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

    //引数のblob画像をデータURL形式にしてStateにセットする
    const ReadImageAsURL = async (imageFile) => {
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
            props.setImageFile(reader.result);
        };
    }

    const cameraOn = () => {
        setIsCameraOn(true);
    }

    const cameraOff = () => {
        setIsCameraOn(false);
    }

    const imageFileinputRef = useRef();

    const handleChangeImageFileInput = (e) => {
        ReadImageAsURL(e.target.files[0]);
        document.removeEventListener("paste", imagePaste);
    }

    const handleClickImageSelect = () => {
        imageFileinputRef.current.click();
    }

    return (
        <>
            {isCameraOn ?
                <Camera setImageFile={(imagefile) => props.setImageFile(imagefile)}
                    cameraOff={() => cameraOff()}
                    setScreenError={(error) => props.setScreenError(error)}
                />
                : null
            }

            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
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
                            <Icon name='picture' />
                            クリックまたはドラッグ&ドロップもしくはカメラから
                        </Header>
                        G15画像を指定してください<br />
                        キャプチャ画像をそのままCtrl + VしてもOKです
                    </Segment>
                </div>
                <Button onClick={cameraOn} ><Icon name='camera' />カメラから(スマホ向け)</Button>

            </motion.div>

        </>
    )
}

export default UploadImage