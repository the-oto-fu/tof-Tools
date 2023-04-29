export namespace Constants {
    /** 画面パス */
    export namespace ScreenPath {
        export const TOP = '/';
        export const MINIKUJI = '/minikuji';
        export const TREAUSURE_MAPPING = '/treasuremapping';
        export const OFFER_IMAGE = TREAUSURE_MAPPING + '/offer';
    }

    /** APIエンドポイント */
    export namespace ApiEndpoint {
        export namespace FF14 {
            export const API_BASE = 'https://bh64vjmz22.execute-api.ap-northeast-1.amazonaws.com/stage';
            export const OFFERMAPIMAGE = API_BASE + '/offermapimage';
            export const G15 = API_BASE + '/g15';
            export const REGISTERPOSITION = API_BASE + '/registerposition';
        }
    }

    /** オブジェクト定義 */
    export namespace ObjectType {
        export type ScreenError = {
            category: string,
            errorMessage: string
        };

        export type TreasuremappingResponse = {
            mapNumber: string,
            position: string,
            requestId: string
        };
    }

    /** オプション */
    export namespace DropDownOption {
        export const mapNumberOptions = [
            { key: '1', text: '1', value: '1' },
            { key: '2', text: '2', value: '2' },
            { key: '3', text: '3', value: '3' },
            { key: '4', text: '4', value: '4' },
            { key: '5', text: '5', value: '5' },
            { key: '6', text: '6', value: '6' },
            { key: '7', text: '7', value: '7' },
            { key: '8', text: '8', value: '8' },
        ]
    }
}