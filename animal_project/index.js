class Animal {
    constructor(name) {
        this.name = name;
        this.types = [];
    }
    addType(breed, size) {
        this.types.push(new Type(breed, size)); 
    }
}

class Type {
    constructor (breed, size) {
        this.breed = breed;
        this.size = size;
    }
}

class AnimalService {
    static url = 'https://63c3325ee3abfa59bdb9c449.mockapi.io'; 

    static getAllAnimals() {
        return $.get(this.url); 
    }

    static getAnimal(id) {
        return $.get(this.url + '/$(id)');
    }

    static createAnimal(animal) {
        return $.post(this.url, animal); 
    }

    static updateAniaml(animal) {
        return $.ajax( {
            url: this.url + `/${animal._id}`, 
            dataType: 'json', 
            data: JSON.stringify(animal), 
            contentType: 'application/json',
            type: 'PUT'
        }); 
    }
    static deleteAnimal(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        }); 
    }
}

class DOMManager {
    static animals; 

    static getAllAnimals() {
        AnimalService.getAllAnimals().then(animals => this.render (animals)); 
    }

    static createAnimal(name) {
        AnimalService.createAnimal(new Animal(name))
        .then(() =>{
            return AnimalService.getAllAnimals();
        })
        .then((animals) => this.render(animals)); 

    }
    static deleteHouse(id) {
        AnimalService.deleteHouse(id)
            .then(() => {
                return HouseService.getAllHouse();
            })
            .then((houses) => this.render(houses)); 
    }

    static addType(id) {
        for (let animal of this.animals) {
            if (animal._id == id) {
                animal.types.push(new Type ($(`#${animal._id}-type-breed`).val(), $(`#${animal._id}-type-size`).val()));
                AnimalService.updateAnimal(animal) 
                .then(() => {
                    return AnimalService.getAllAnimals();
                })
                .then((animals) => this.render(animals)); 
            }
        }
    }

    static deleteRoom(animalID, typeID) {
        for (let animal of this.animals) {
            if (animal._id == animalID) {
                for (let type of animal.types) {
                    if (type._id = typeID) {
                        animal.types.splice(animal.types.indexOf(type), 1);
                        AnimalService.updateAnimal(animal)
                        .then(() => {
                            return AnimalService.getAllAnimals ();
                        })
                        .then((animals) => this.render(animals)); 
                    }
                }
            }
        }
    }

    static render(animals) {
        this.animals = animals; 
        $('#app').empty(); 
        for (let animal of animals) {
            $('#app.').prepend(
                `<div id="${animal._id}" class="card">
                    <div class="card-header">
                    <h2>${animal.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteAnimal('${animal._id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                               <input type="text" id="${animal._id}-type-breed" class="form-control" placeholder="Type Breed">
                        </div>
                            <div class="col-sm">
                               <input type="text" id="${animal._id}-type-size" class="form-control" placeholder="Type Size">
                            </div>
                        </div>
                        <button id="${animal._id}-new-type" onclick="DOMManager.addType('${animal._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
            </div><br>` 
        ); 
        for (let type of animal.types) {
            $(`#${animal._id}`).find('.card-body').append(
                `<p>
                    <span id="breed-${type._id}"><strong>Breed: </strong> ${type.breed}</span>
                    <span id="size-${type._id}"><strong>Size: </strong> ${type.size}</span>
                    <button class="btn btn-danger" onclick=DOMManager.deleteType('${animal._id}', '${type._id}')">Delete Room</button>`
            )
        }
        }
    }
}

$('#create-new-animal').on(() => {
    DOMManager.createAnimal($('#new-animal-name').val());
    $('#new-animal-name').val('');
})

DOMManager.getAllAnimals();