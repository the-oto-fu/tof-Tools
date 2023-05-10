export const getBase64Image = (imageFile: string) => {
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