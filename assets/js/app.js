const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const imageBoy = new Image()
const imageKinoko = new Image()
const imagePoisonKinoko = new Image()
imageBoy.src = './assets/img/ico_boy1_8.gif'
imageKinoko.src = './assets/img/ico_mushroom2_12.gif'
imagePoisonKinoko.src = './assets/img/ico_mushroom2_15.gif'

let Kinokos = []
let PoisonKinokos = []

const getKinokoText = document.getElementById('text')
const kinokoCountText = document.getElementById('catchKinoko')
let kinokoCount = 0
const kinokoXposMax = 780
const kinokoXposMin = 20

// TODO あとで細かくclass作る
class Boy {
  constructor(x, width, height) {
    this.x = x
    this.y = 500 - height
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
    this.speedY = 10
    this.width = width
    this.height = height
    this.isSlow = false
  }
  // センター座標の割り出し
  calculateCenterPos(){
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
  }
  move(keyEvent) {
    if(keyEvent === 'ArrowRight' && this.x < 780){
      this.x += 20
    }else if(keyEvent === 'ArrowLeft' && this.x > 0){
      this.x -= 20
    }
    ctx.drawImage(imageBoy, this.x, this.y, this.width, this.height)
    this.calculateCenterPos()
  }
  computedDistance(obj){
    const distanceX = Math.abs(obj.centerX - this.centerX)
    const distanceY = Math.abs(obj.centerY - this.centerY)
    return distanceX <= 20 && distanceY <= 20
  }
  getKinoko(){
    Kinokos.forEach((kinoko)=>{
      if(this.computedDistance(kinoko)){
        kinoko.reuseKinoko()
        getKinokoText.innerText = 'きのこゲット！'
        kinokoCount ++;
        kinokoCountText.innerText = kinokoCount
      }
    })
  }
  touchPoisonKinoko(){
    PoisonKinokos.forEach((poisonKinoko)=>{
      if(this.computedDistance(poisonKinoko)){
        poisonKinoko.reuseKinoko()
        getKinokoText.innerText = '毒きのこだ！'
        this.isSlow = true
      }
    })
  }
  slowMove(keyEvent){
    if(keyEvent === 'ArrowRight' && this.x < 780){
      this.x += 5
    }else if(keyEvent === 'ArrowLeft' && this.x > 0){
      this.x -= 5
    }
    ctx.drawImage(imageBoy, this.x, this.y, this.width, this.height)
    this.calculateCenterPos()
  }
}
// TODO あとでextends使う
class Kinoko {
  constructor(x, y, width = 20, height = 20) {
    this.x = x
    this.y = y
    this.centerX = this.x + width / 2
    this.centerY = this.y + height / 2
    this.width = width
    this.height = height
    this.isCatchedKinoko = false
    this.speed = makeRandomNum(5, 1)
  }
  calculateCenterPos(){
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
  }
  move() {
    this.y += this.speed
    this.calculateCenterPos()
    if (this.y > 500) {
      this.reuseKinoko()
    }
    ctx.drawImage(imageKinoko, this.x, this.y, this.width, this.height)
  }
  reuseKinoko(){
    this.x = makeRandomNum(kinokoXposMax, kinokoXposMin)
    this.y = -100
    this.speed = makeRandomNum(5, 1)
  }
}

// TODO あとでextends 毒キノコ
class PoisonKinoko{
  constructor(x, y, width = 20, height = 20) {
    this.x = x
    this.y = y
    this.centerX = this.x + width / 2
    this.centerY = this.y + height / 2
    this.width = width
    this.height = height
    this.isCatchedKinoko = false
    this.speed = makeRandomNum(5, 1)
  }
  calculateCenterPos(){
    this.centerX = this.x + this.width / 2
    this.centerY = this.y + this.height / 2
  }
  move() {
    this.y += this.speed
    this.calculateCenterPos()
    if (this.y > 500) {
      this.reuseKinoko()
    }
    ctx.drawImage(imagePoisonKinoko, this.x, this.y, this.width, this.height)
  }
  reuseKinoko(){
    this.x = makeRandomNum(kinokoXposMax, kinokoXposMin)
    this.y = -100
    this.speed = makeRandomNum(5, 1)
  }
}

imageBoy.onload = () => {
  ctx.drawImage(imageBoy, boy.x, boy.y, boy.width, boy.height)
}
imageKinoko.onload = () => {
  Kinokos.forEach((kinoko) => {
    kinoko.move()
  })
}
imagePoisonKinoko.onload = () => {
  PoisonKinokos.forEach((poisonKinoko) => {
    poisonKinoko.move()
  })
}

const makeRandomNum = (max, min) => {
  const num = Math.floor(Math.random() * (max - min + 1) + min)
  return num
}

const makeKinokos = () => {
  let kinoko = []
  for (let i = 0; i < makeRandomNum(10,5); i++) {
    const randumX = makeRandomNum(kinokoXposMax, kinokoXposMin)
    const randumY = makeRandomNum(10, 1)
    kinoko[i] = new Kinoko(randumX, randumY)
    Kinokos.push(kinoko[i])
  }
  return kinoko
}
makeKinokos()

const makePoisonKinokos = () => {
  let poisonKinoko = []
  for (let i = 0; i < makeRandomNum(5,1); i++) {
    const randumX = makeRandomNum(kinokoXposMax, kinokoXposMin)
    const randumY = makeRandomNum(10, 1)
    poisonKinoko[i] = new PoisonKinoko(randumX, randumY)
    PoisonKinokos.push(poisonKinoko[i])
  }
  return poisonKinoko
}
makePoisonKinokos()


let boy = new Boy(0, 18, 34)

function mainLoop() {
  let loopId = window.requestAnimationFrame(mainLoop)
  ctx.clearRect(0,0,800,500)
  boy.move()
  boy.getKinoko()
  boy.touchPoisonKinoko()
  Kinokos.forEach((kinoko) => {
    kinoko.move()
  })
  PoisonKinokos.forEach((poisonKinoko) => {
    poisonKinoko.move()
  })
  if(kinokoCount > 10){
    cancelAnimationFrame(loopId)
  }
}
requestAnimationFrame(mainLoop)

window.onkeydown = (e) => {
  boy.isSlow ? boy.slowMove(e.code) : boy.move(e.code)
}
