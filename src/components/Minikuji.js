import React from 'react'

const Minikuji = () => {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var openCount = 0;
    //スコア
    let scoreMap = {
      6: "10,000",
      7: "36",
      8: "720",
      9: "360",
      10: "80",
      11: "252",
      12: "108",
      13: "72",
      14: "54",
      15: "180",
      16: "72",
      17: "180",
      18: "119",
      19: "36",
      20: "306",
      21: "1,080",
      22: "144",
      23: "1,800",
      24: "3,600"
    };
    
    /*
    function init() {
      openCount = 0;
      for (var i = numbers.length - 1; i > 0; i--) {
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = numbers[i];
        numbers[i] = numbers[r];
        numbers[r] = tmp;
      }
      var minikuji = document.getElementById('minikuji');
      minikuji.innerHTML = '';
      //矢印の表示
      minikuji.innerHTML += '<img src="img/Allow_rightdown.png" id = "arrow1" class = "arrowHead" onclick=determineRow(this)>';
      minikuji.innerHTML += '<img src="img/Allow_down.png" id = "arrow2" class = "arrowHead" onclick=determineRow(this)>';
      minikuji.innerHTML += '<img src="img/Allow_down.png" id = "arrow3" class = "arrowHead" onclick=determineRow(this)>';
      minikuji.innerHTML += '<img src="img/Allow_down.png" id = "arrow4" class = "arrowHead" onclick=determineRow(this)>';
      minikuji.innerHTML += '<img src="img/Allow_leftdown.png" id = "arrow5" class = "arrowHead" onclick=determineRow(this)>';
      minikuji.innerHTML += '<br>';
      var count = 1;
      var arrowCount = 6;
      while (count <= 9) {
        //矢印の表示
        if (count == 1 || count == 4 || count == 7) {
          minikuji.innerHTML += '<img src="img/Allow_right.png" id = "arrow' + arrowCount + '" onclick=determineRow(this)>';
          arrowCount++;
        }
        minikuji.innerHTML += '<img src="img/unselected.png" id ="' + numbers[count - 1] + '" onclick="select(this, true)">';
        if (count % 3 == 0) {
          minikuji.innerHTML += '<br>';
        }
        count++;
      }
      //最初に開いているいるマスを設定
      var initOpen = String(getRandomIntInclusive(1, 9));
      var initOpenCircle = document.getElementById(initOpen);
      select(initOpenCircle, false);
    }
    //選択したマスの画像を切り替える
    function select(img, countup) {
      if (openCount >= 3) {
        return;
      }
      img.src = 'img/' + img.id + '.png';
      if (countup == true) {
        openCount++;
      }
    }
    
    function allOpen() {
      for (id = 1; id <= 9; id++) {
        var img = document.getElementById(id);
        img.src = 'img/' + id + '.png';
      }
    }
    //min～maxを含むランダムな数値を取得
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //列を決定し結果を表示する
    function determineRow(img) {
      var numberSum = 0;
      switch (img.id) {
      case "arrow1":
        numberSum = numbers[0] + numbers[4] + numbers[8];
        break;
      case "arrow2":
        numberSum = numbers[0] + numbers[3] + numbers[6];
        break;
      case "arrow3":
        numberSum = numbers[1] + numbers[4] + numbers[7];
        break;
      case "arrow4":
        numberSum = numbers[2] + numbers[5] + numbers[8];
        break;
      case "arrow5":
        numberSum = numbers[2] + numbers[4] + numbers[6];
        break;
      case "arrow6":
        numberSum = numbers[0] + numbers[1] + numbers[2];
        break;
      case "arrow7":
        numberSum = numbers[3] + numbers[4] + numbers[5];
        break;
      case "arrow8":
        numberSum = numbers[6] + numbers[7] + numbers[8];
        break;
      }
      allOpen();
      alert(scoreMap[numberSum] + ' MGP');
    }
    */

  return (
    <>
    <div id="minikuji">
    </div>
    <img src="minikuji/Retry.png" id="retry" onClick="init()"></img>
    </>
  )
}

export default Minikuji