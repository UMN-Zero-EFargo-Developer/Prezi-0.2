class Game{
    constructor() {
        this.fog = {
            isOn: false,
            setting: {
                'range': [-1, 1.5],
                'color': 'white',
                'horizon-blend': 0.1
            }
        }
    }

    removeFog(){
        this.fog.isOn = false;
        return false;
    }
    addFog(){
        this.fog.isOn = true;
        return true;
    }
}