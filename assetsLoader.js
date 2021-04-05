let assets = {
  images: {
    human: 'assets/human.png',
    tree: 'assets/tree.png',
    rock: 'assets/rock.png',
    hut: 'assets/hut.png',
    wheat: 'assets/wheat.png',
    wheatfarm: 'assets/wheatfarm.png',
  },
  sounds: {
    example: './assets/sounds/example.mp3',
  }
}

loopAssetsChildren(assets, [], {})

function loopAssetsChildren(obj, keys) {
  for(let obj1key in obj) {
    let obj1 = obj[obj1key]
    let newKeys = [...keys, obj1key]
    if(typeof obj1 == 'object') {
      loopAssetsChildren(obj1, newKeys)
    }
    else if(typeof obj1 == 'string') {
      let res = ''
      if(obj1.endsWith('.png') || obj1.endsWith('.jpg')) {
        let img = new Image()
        img.src = obj1
        res = img
      }
      if(obj1.endsWith('.webm') || obj1.endsWith('.wav') || obj1.endsWith('.mp3')) {
        let howl = new Howl({ src: obj1 })
        res = howl
      }
      let evaltxt = ''
      for(let i=0;i<newKeys.length;i++) evaltxt += `['${newKeys[i]}']`
      eval(`assets${evaltxt} = res`)
    }
  }
}