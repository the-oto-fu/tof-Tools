import { useState, useEffect } from "react";
import { Button, Container, Dropdown, DropdownProps, Header, Dimmer, Loader, Message, Icon } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import axios from 'axios';
import UploadImage from "./utilities/UploadImage";
import { Constants } from '../config/constants'

const OfferMapImage = () => {

    const [imageFile, setImageFile] = useState('');
    const [positionRegistered, setPositionRegistered] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [screenError, setScreenError] = useState<Constants.ObjectType.ScreenError | null>(null);

    const liftUpImageFile = (newImageFile: string) => {
        setImageFile(newImageFile);
    }

    const liftUpScreenError = (newScreenError: Constants.ObjectType.ScreenError) => {
        setScreenError(newScreenError);
    }

    //選択した画像の状態が変わる(nullを含む)と他の状態も初期化する
    useEffect(() => {
        setPositionRegistered(false);
    }, [imageFile])

    const getBase64Image = () => {
        if (imageFile) {
            //正規表現を()でくくるとキャプチャグループとなり、その部分が戻り値配列の[1]移行の要素として設定される
            //matches[0]がマッチした文字列全体、[1]が一つ目のキャプチャグループ(拡張子)、[2]が2つめのキャプチャグループ(base64内容)
            const matches = imageFile.match(/^data:\w+\/(\w+);base64,(.*)$/);
            if (matches && matches.length >= 2) {
                return [matches[1], matches[2]];
            }
        }
        //TODO: error throw
        return ['', ''];
    }

    const registerMapImage = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setIsProcessing(true);

        let tmpImageExtention, image64Content;
        [tmpImageExtention, image64Content] = getBase64Image();

        axios.post(Constants.ApiEndpoint.FF14.OFFERMAPIMAGE,
            {
                mapImage: image64Content,
                imageExtention: tmpImageExtention,
                category: 'G15',
                location: 'エルピス',
                number: String(data.value)
            }
        )
            .then(() => {
                setIsProcessing(false);
                setPositionRegistered(true);
            })
            .catch((error) => {
            });
    }

    return (
        <>
            {isProcessing
                ? <Dimmer active inverted><Loader>処理中…</Loader></Dimmer>
                : null}
            <Header as='h1'>画像提供専用ページ{'<G15>'}</Header>
            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {imageFile ?
                    <>
                        <img className="image-preview" src={imageFile} alt="アップロードした画像のプレビュー" />
                        <Button className="reset-button" onClick={() => setImageFile('')}>画像を選び直す</Button>

                        <motion.div
                            initial={{ y: "100vh" }}
                            animate={{
                                y: "0",
                                transitionEnd: {
                                    transform: "none"
                                }
                            }}
                            transition={{ type: "spring", stiffness: 80 }}
                        >                        <div className="overview-container">
                                {positionRegistered ?
                                    <div className="gaming thanks">Thank you!!</div>
                                    :
                                    <Dropdown
                                        placeholder="提供する地図の番号を選択してください"
                                        className="map-number-dropdown"
                                        selection
                                        options={Constants.DropDownOption.mapNumberOptions}
                                        onChange={registerMapImage}
                                        disabled={positionRegistered}
                                        clearable
                                        //下記は何も選択しない際に1つ目のオプションが選択されるのを防止するため
                                        selectOnBlur={false}
                                    />
                                }
                                <img className="map-overview" src="/treasuremapping/overview_g15.png" alt="全体の地図" />
                            </div>
                        </motion.div>
                    </>
                    :
                    <>
                        <Container>
                            <UploadImage
                                liftUpImageFile={(newImageFile) => liftUpImageFile(newImageFile)}
                                liftUpScreenError={(error) => liftUpScreenError(error)}
                            />
                        </Container>

                        <Message warning compact>
                            <Message.Header><Icon name='exclamation circle' />スマホから撮影した画像が不足しています</Message.Header>
                            <p>
                                このページから画像の提供を是非お願いします🙏
                            </p>
                        </Message>
                    </>
                }
            </motion.div>
        </>
    )
}

export default OfferMapImage