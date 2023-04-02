import { useState, useRef, useEffect } from 'react'
import { Menu, Icon, Sticky } from 'semantic-ui-react'

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
  const headerMenuRef = useRef()
  //  const documentClickHandler = useRef()


  const handelToggleMenu = (e) => {
    console.log('menu clicked.')
    setIsShown(!isShown)
    if (!isShown) {
      //Reactの合成イベントに対する親要素へのイベントの伝搬を抑止する
      //menuをクリックした際に親要素のdocumentのリスナーが即時発火してしまうことを抑止
      e.stopPropagation()
      document.addEventListener('click', documentClickHandler)
    }
  }

  const documentClickHandler = (e) => {
    console.log('document clicked.')
    if (headerMenuRef.current.contains(e.target)) {
      return
    }

    setIsShown(false)
    document.removeEventListener('click', documentClickHandler)
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
      <div
        className='header-menu'
        ref={headerMenuRef}
      >
        {isShown ? <HeaderMenu /> : null}
      </div>
    </>
  )
}

export default SiteHeader
