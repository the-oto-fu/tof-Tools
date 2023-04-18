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
                    デサイファーで表示された宝の地図の画像をキャプチャして、以下のような画像を用意してください。
                </p>
                <img src="/treasuremapping/map_sample.png" className='help-image'/>
                <div className='image-description'>Windowsの場合は「切り取り&スケッチ」Macなら「スクリーンショット」アプリなどを使うのがおすすめです</div>
                <p>
                    なるべく画像いっぱいに地図が映っているようにするのがポイント!
                </p>
                <p>
                    画像を指定したら「座標を特定!」すると解析が始まります。
                </p>
            </Modal.Content>
        </Modal>
    )
}

export default TreasureMappingHelp