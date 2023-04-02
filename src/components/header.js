import { useState, useRef, useEffect } from 'react'
import { Menu, Icon, Sticky } from 'semantic-ui-react'

const handleClickSiteName = () => {
  console.log('clicked.')
}

function SiteHeader() {

  const [isShown, setIsShown] = useState(false)
  const headerMenuRef = useRef()
  //  const documentClickHandler = useRef()

  function HeaderMenu() {
    return (
      <Menu vertical>
        <Menu.Item onClick={handleMenuContentClick}>Visit another website</Menu.Item>
        <Menu.Item>Link via prop</Menu.Item>
        <Menu.Item>Javascript Link</Menu.Item>
      </Menu>
    )
  }  

  const handleToggleMenu = (e) => {
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

  const handleMenuContentClick = () => {
    console.log('menu content clicked.')
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
          <Menu.Item onClick={handleToggleMenu}>
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
