import { Icon, Modal } from 'semantic-ui-react'

const TreasureMappingHelp = () => {
    return (
        <Modal
            basic
            size='small'
            trigger={<div className="help"><Icon name='help circle' />使いかた</div>}
        >
            <Modal.Content>
                <p>
                    ディサイファーで表示された宝の地図の画像をキャプチャして、以下のような画像を用意してください。
                </p>
                <img src="/treasuremapping/map_sample.png" className='help-image' alt="アップロード画像のサンプル"/>
                <div className='image-description'>Windowsの場合は「切り取り & スケッチ」Macなら「スクリーンショット」アプリなどを使うのがおすすめです</div>
                <p>
                    なるべく画像いっぱいに地図が映っているようにするのがポイント!
                </p>
                <p>
                    画像を指定したら「座標を特定!」すると解析が始まります。
                </p>
                <p>
                    解析はせず、画像の提供のみを行いたい方は「画像提供はこちら」を押してください。
                </p>
            </Modal.Content>
        </Modal>
    )
}

export default TreasureMappingHelp