import { useState, useRef } from 'react'
import { Menu, Icon } from 'semantic-ui-react'

const handleClickSiteName = () => {
  console.log('clicked.')
}

function HeaderMenu() {
  return (
    <Menu vertical>
      <Menu.Item href='//example.com' target='_blank'>
        Visit another website
      </Menu.Item>
      <Menu.Item>Link via prop</Menu.Item>
      <Menu.Item>Javascript Link</Menu.Item>
    </Menu>
  )
}

function SiteHeader() {

  const [isShown, setIsShown] = useState(false)

  const handelToggleMenu = (e) => {
    console.log('menu clicked.')
    setIsShown(!isShown)
    if(!isShown) {
    //Reactの合成イベントに対する親要素へのイベントの伝搬を抑止する
    //menuをクリックした際に親要素のdocumentのリスナーが即時発火してしまうことを抑止
    e.stopPropagation()
    document.addEventListener('click', documentClickHander)  
    }
  }

  const headerMenuRef = useRef()

  const documentClickHander = (e) => {
    console.log('document clicked.')

    setIsShown(false)
    document.removeEventListener('click', documentClickHander)
  }

  return (
    <>
      <Menu borderless fixed='top' color='blue' inverted>
        <Menu.Item
          onClick={handleClickSiteName}
        >
          <h4>tof-Tools</h4>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item onClick={handelToggleMenu}>
            <div className="header-menubar">
              MENU
              <Icon name='bars' />
            </div>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <div className={`headerMenu ${isShown ? 'shown' : ''}`}
        ref={headerMenuRef}
      >
        <HeaderMenu />
      </div>
    </>
  )
}

export default SiteHeader
