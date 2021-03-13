const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const imageBoy = new Image()
const imageKinoko = new Image()
imageBoy.src = './assets/img/ico_boy1_8.gif'
imageKinoko.src = './assets/img/ico_mushroom2_23.gif'

let Kinokos = []

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
  getKinoko(){
    Kinokos.forEach((kinoko)=>{
      const distanceX = Math.abs(kinoko.centerX - this.centerX)
      const distanceY = Math.abs(kinoko.centerY - this.centerY)
      if(distanceX <= 20 && distanceY <= 20){
        kinoko.reuseKinoko()
        getKinokoText.innerText = 'きのこゲット！'
        kinokoCount ++;
        kinokoCountText.innerText = kinokoCount
      }
    })
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

let BOY = new Boy(0, 18, 34)

imageBoy.onload = () => {
  ctx.drawImage(imageBoy, BOY.x, BOY.y, BOY.width, BOY.height)
}
imageKinoko.onload = () => {
  Kinokos.forEach((kinoko) => {
    kinoko.move()
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


function mainLoop() {
  ctx.clearRect(0,0,800,500)
  BOY.move()
  BOY.getKinoko()
  Kinokos.forEach((kinoko) => {
    kinoko.move()
  })
  window.requestAnimationFrame(mainLoop)
}

window.requestAnimationFrame(mainLoop)

window.onkeydown = (e) => {
  BOY.move(e.code)
}
