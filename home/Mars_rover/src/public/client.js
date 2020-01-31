
let store = Immutable.Map( {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    selectedRover: '',
    sol: '',
    images : '',
});

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    console.log(state);
    root.innerHTML = await App(state)
}


// create content
const App = async (state) => {
    let { rovers, apod } = state
    return `
        <header></header>
        <main>
            <section>
                <div class="jumbotron">
                    <div class="row">
                        <div class="col-md">
                            <span class="dashboard_title">Mars Rover Dashboard</span>
                        </div>
                    </div>
                </div>
                <div class="container-fluid">
                 <div class="row">
                  <div class="col-md">
                    ${rednerRover(store.get('rovers'))}
                  </div>
                 </div>
                   
                    <div class="row">
                        <div class="col-md mt-5">
                            <span id="rover_information"></span>
                            ${displayImageData(store)}
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }
    return `
        <h1>Hello!</h1>
    `
}

const rednerRover = (rovers) => {
    const Tab = (r) => 
       `<button type="button" class="tablinks" data-rover-name="${r}" onclick="selectRover(event)">${r}</button>`
    return rovers.map(r => Tab(r)).join(' ');
}

const selectRover = async (e) => {
    let rover = e.target.getAttribute('data-rover-name')
    if (rover == store.get('selectedRover')) {
        return
    }
    updateStore(store, { selectedRover: rover, data: null })
    await informationRover(store)
    .then(data => updateStore(store, { data }))
}

const displayImageData = (state) => {
    if(state != null)
    {
        if(state.data != null) {
            selectImages(state);
            if(store.images!= null)
            {
                return (`
                <p><b>Rover Name</b> : ${store.data.photo_manifest.name}</p>
                <p><b>Landing date</b> : ${store.data.photo_manifest.landing_date}</p>
                <p><b>Launch date</b> : ${store.data.photo_manifest.launch_date}</p>
                <p><b>Status</b> : ${store.data.photo_manifest.status}</p>
                <p>${store.images}</p>
        `)
            }
                
        }
        else return `<p></p>`;  
    }
    else return `<p></p>`;
}


// Example of a pure function that renders infomation requested from the backend
const selectImages = async(state) => {
    let {data} = state
    let { photo_manifest } = data;
    const dataLength = photo_manifest.photos.length;

    // storing the latest sol
    store.sol = photo_manifest.photos[dataLength - 1].sol;

    let images = await imagesClickedByRover();
    
    clubAllImages(images)
    .then(img => updateStore(store, {images : img}))
}

const clubAllImages = async (images) => {
    let text = "";
    images.photos.map((element, index) => {
        text += `
        <div>
            <img src=${element.img_src} height=300 width=300/>
            <br> 
            <span>${element.earth_date}</span>
        </div>`;
    });
    
    return text;
}


// ----------------------------`--------------------------  API CALLS

// Example API call
const informationRover = async (state) => {
    let { selectedRover } = state
    let data = await fetch(`http://localhost:3000/rover?rover_name=${selectedRover}`);
    console.log(data);
    return data.json();
}

const imagesClickedByRover = async () => {
    let images = await fetch(`http://localhost:3000/rover/images?rover_name=${store.selectedRover}&sol=${store.sol}`);
    return images.json();
}
