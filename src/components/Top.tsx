import { OpacityMotion }  from './utilities/Motion'

function Top() {
    return (
        <OpacityMotion>
            <div className="shapes">
                <div className="shape shape1"></div>
                <div className="shape shape2"></div>
                <div className="shape shape3"></div>
            </div>

            <div className="toppage-content">
                <div>tofTool</div>
                <p>
                    工事中で〜す
                </p>
            </div>
        </OpacityMotion>
    )
}

export default Top
