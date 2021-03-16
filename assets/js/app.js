const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// 画像設定
const imageBoy = new Image()
const imageKinoko = new Image()
const imagePoisonKinoko = new Image()
const imageSpecialKinoko = new Image()
imageBoy.src = './assets/img/ico_boy1_8.gif'
imageKinoko.src = './assets/img/ico_mushroom2_12.gif'
imagePoisonKinoko.src = './assets/img/ico_mushroom2_15.gif'
imageSpecialKinoko.src = './assets/img/ico_mushroom2_2.gif'

// 複数きのこ配列
let Kinokos = []
let PoisonKinokos = []

let gameObjs = []

// 表示テキスト
const getKinokoText = document.getElementById('text')
const kinokoCountText = document.getElementById('normalKinoko')
const poisonKinokoCountText = document.getElementById('poisonKinoko')
const spKinokoCountText = document.getElementById('specialKinoko')
const timerText = document.getElementById('timer')
let timerCount = 0
let kinokoCount = 0
let poisonKinokoCount = 0
let spKinokoCount = 0
const kinokoXposMax = 772
const kinokoXposMin = 20

const startBtn = document.getElementById('start')

// タイマー
let timer = 10
timerText.innerText = timer;
let isStarted = false

// 画面設定
const canvasH = 500
const canvasW = 792
const kinokoBorderLine = 500 - 32 - 20
const boyStandPos = 500 - 32 - 34
class GameObjects {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
    this.width = width
    this.height = height
    gameObjs.push(this) 
  }
  computedDistance(obj){
    const distanceX = Math.abs(obj.centerX - this.centerX)
    const distanceY = Math.abs(obj.centerY - this.centerY)
    return distanceX <= 20 && distanceY <= 20
  }
  calculateCenterPos(){
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
  }
  draw(image){
    ctx.drawImage(image, this.x, this.y, this.width, this.height)
  }
}

class Boy extends GameObjects{
  constructor(x, y, width, height){
    super(x, y, width, height)
    this.isSlow = false
  }
  move(keyEvent) { // TODO move → updateに変更
    let speed = this.isSlow ? -3 : 18;
    if(keyEvent === 'ArrowRight' && this.x < 774){
      this.x += speed
    }else if(keyEvent === 'ArrowLeft' && this.x > 0){
      this.x -= speed
    }
    super.draw(imageBoy)
    super.calculateCenterPos()
    this.getKinoko()
  }
  getKinoko(){
    Kinokos.forEach((kinoko)=>{
      if(this.computedDistance(kinoko)){
        kinoko.reuseKinoko(makeRandomNum(5, 1))
        getKinokoText.innerText = 'きのこゲット！'
        kinokoCount ++;
        kinokoCountText.innerText = kinokoCount
      }
    })
    PoisonKinokos.forEach((poisonKinoko)=>{
      if(this.computedDistance(poisonKinoko)){
        poisonKinoko.reuseKinoko(makeRandomNum(5, 1))
        getKinokoText.innerText = '毒きのこだ！'
        this.isSlow = true
        poisonKinokoCount ++;
        poisonKinokoCountText.innerText = poisonKinokoCount
      }
    })
    if(this.computedDistance(specialKinoko)){
      getKinokoText.innerText = 'スペシャルきのこゲット！！'
      spKinokoCount ++;
      spKinokoCountText.innerText = spKinokoCount
      this.isSlow = false
    }
  }
}
class Kinoko extends GameObjects {
  constructor(x, y, width, height){
    super(x, y, width, height)
    this.speed = makeRandomNum(5, 1)
  }
  move() {
    this.y += this.speed
    this.calculateCenterPos()
    if (this.y > kinokoBorderLine) {
      this.reuseKinoko(makeRandomNum(5, 1))
    }
    super.draw(imageKinoko)
  }
  reuseKinoko(speed){
    this.x = makeRandomNum(kinokoXposMax, kinokoXposMin)
    this.y = -100
    this.speed = speed
  }
}

class PoisonKinoko extends Kinoko{
  constructor(x, y, width, height){
    super(x, y, width, height)
  }
  move() {
    super.move()
    super.draw(imagePoisonKinoko)
  }
  reuseKinoko(){
    super.reuseKinoko(makeRandomNum(5, 1))
  }
}

class SpecialKinoko extends Kinoko{
  constructor(x, y, width, height){
    super(x, y, width, height)
    this.speed = 10
    this.isReady = false
    setTimeout(() => {
      this.isReady = true
    }, makeRandomNum(3000, 15000));
  }
  move() {
    if(!this.isReady) return // 早期リターン

    this.y += this.speed
    this.calculateCenterPos()
    if (this.y > kinokoBorderLine) {
      setTimeout(() => {
        this.reuseKinoko(this.speed)
      }, 5000)
    }
    super.draw(imageSpecialKinoko)
  }
  reuseKinoko(){
    super.reuseKinoko(10)
  }
}

// imageBoy.onload = () => {
//   ctx.drawImage(imageBoy, boy.x, boy.y, boy.width, boy.height)
// }
// imageSpecialKinoko.onload = () => {
//   ctx.drawImage(imageSpecialKinoko, specialKinoko.x, specialKinoko.y, specialKinoko.width, specialKinoko.height)
// }
// imageKinoko.onload = () => {
//   Kinokos.forEach((kinoko) => {
//     kinoko.move()
//   })
// }
// imagePoisonKinoko.onload = () => {
//   PoisonKinokos.forEach((poisonKinoko) => {
//     poisonKinoko.move()
//   })
// }

const makeRandomNum = (max, min) => {
  const num = Math.floor(Math.random() * (max - min + 1) + min)
  return num
}
const makeKinokos = () => {
  let kinoko = []
  for (let i = 0; i < makeRandomNum(25, 20); i++) {
    const randumX = makeRandomNum(kinokoXposMax, kinokoXposMin)
    const randumY = makeRandomNum(10, 1)
    kinoko[i] = new Kinoko(randumX, randumY, 20, 20)
    Kinokos.push(kinoko[i])
  }
  return kinoko
}

const makePoisonKinokos = () => {
  let poisonKinoko = []
  for (let i = 0; i < makeRandomNum(20,15); i++) {
    const randumX = makeRandomNum(kinokoXposMax, kinokoXposMin)
    const randumY = makeRandomNum(10, 1)
    poisonKinoko[i] = new PoisonKinoko(randumX, randumY, 20, 20)
    PoisonKinokos.push(poisonKinoko[i])
  }
  return poisonKinoko
}


function mainLoop() {
  if(isStarted){
    let loopId = window.requestAnimationFrame(mainLoop)
    ctx.clearRect(0,0,canvasW,canvasH)
    gameObjs.forEach((gameObj) => {
      gameObj.move()
    })  
    if(!timer){
      stopCountDown()
      getKinokoText.innerText = 'タイムアップ！'
      cancelAnimationFrame(loopId)
      window.onkeydown = (e) => {
        e.preventDefault();
      }
      ctx.clearRect(0,0,canvasW,canvasH)
    }
  }else{
    cancelAnimationFrame(loopId)
  }
}


let intervalId;

const startCountDown = () => {
  intervalId = setInterval(()=>{
    timer --;
    timerText.innerText = timer;
    if(timer <= 0){
      clearInterval(intervalId);
    }
  }, 1000)
}
const stopCountDown = () => {
  clearInterval(intervalId);
}
const gameStart = () => {
  let boy = new Boy(792 / 2, boyStandPos, 18, 34)
  let specialKinoko = new SpecialKinoko(makeRandomNum(780, 20), -50, 20, 20)
  window.onkeydown = (e) => {
    boy.move(e.code)
  }
  startCountDown()
  makePoisonKinokos()
  makeKinokos()
}

startBtn.addEventListener('click', (e) => {
  isStarted = true;
  gameStart()
  requestAnimationFrame(mainLoop)
})
