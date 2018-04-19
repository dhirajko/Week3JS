const url = 'http://localhost:5000/alldata';
jsonFile = '';




const listQ = () => {                                                                              //sorted fetch
    const e = document.getElementById("list")

    if (e.selectedIndex > 1) {
        jsonFile.sort((a, b) => {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        // jsonFile.reverse()
    }
    else
        if (e.selectedIndex > 0) {
            jsonFile.sort(function (a, b) {
                var textA = a.color.toUpperCase();
                var textB = b.color.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
            // jsonFile.reverse()
        }

    console.log(jsonFile);
    document.querySelector('.container').innerHTML = '';
    updateUI(jsonFile);
}
document.getElementById("list").addEventListener("click", listQ);

document.querySelector('#click').addEventListener('click',()=>{
  localStorage.setItem('SearchWord',document.querySelector('#search').value);

});



//default page

fetch(url)
    .then((data) => { return data.json() })
    .then((jsonArray) => {
        jsonFile = jsonArray;
        updateUI(jsonFile);
    })
updateUI = function (receivedJSON) {                                                                    // UI of web page


    for (const each of receivedJSON) {
        // console.log(each.image);
        const eachDiv = document.createElement('div'); //creating all required div
        const eachImageDiv = document.createElement('div');
        const titleDiv = document.createElement('div');
        const buttonDiv = document.createElement('div');
        const Image = document.createElement('img');
        const button = document.createElement('button');
        const editButton = document.createElement('button');



        Image.src = each.image; //giving property of required div
        Image.className = 'image';
        eachDiv.className = 'eachThumbnail';
        titleDiv.className = 'Description';
        titleDiv.innerHTML = '<h2>' + each.name + '</h2><br/>' + each.color;
        button.innerHTML = 'view';
        button.className = 'viewbutton';
        button.id = each._id;
        editButton.innerHTML = 'Edit';
        editButton.className = 'editButton';






        button.addEventListener('click', () => {                   //event listener for each view button
            console.log(each.location);

            const modalbox = document.querySelector('.modal');
            const modal_content = document.querySelector('.modal-content');
            const fullimage = document.createElement('img');
            const smallbox = document.createElement('div');

            fullimage.style.width = '100%';
            fullimage.style.height = 'auto';
            fullimage.style.margin = 'inherit';
            fullimage.style.border = '5px solid black';
            fullimage.style.borderRadius = '5px';
            fullimage.src = each.image;
            smallbox.className = 'mapbox';
            if (each.location === undefined) {                            //if location of uploaded image is undefined
                each.location = {
                    GPSLatitudeRef: '',
                    GPSLatitude: [],
                    GPSLongitudeRef: '',
                    GPSLongitude: [],
                    GPSAltitudeRef: null,
                    GPSAltitude: null,
                    GPSTimeStamp: [],
                    GPSDateStamp: ''
                }
            }
            if (isNaN(each.location.GPSLatitude[0])) {
                smallbox.innerHTML = 'No map available';
            } else {
                smallbox.innerHTML = '<iframe src="https://maps.google.com/maps?q=' + (each.location.GPSLatitude[0] + each.location.GPSLatitude[1] / 60 + each.location.GPSLatitude[2] / 3600) + ',' + (each.location.GPSLongitude[0] + each.location.GPSLongitude[1] / 60 + each.location.GPSLongitude[2] / 3600) + '&hl=en&z=14&amp;output=embed" width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe>'
            }

            modalbox.style.display = 'block';
            modal_content.appendChild(fullimage);
            modal_content.appendChild(smallbox);
        });

        editButton.addEventListener('click', () => {
            localStorage.setItem('id', each._id);
            localStorage.setItem('name', each.name);
            localStorage.setItem('dob', each.dob);
            localStorage.setItem('gender', each.gender);
            localStorage.setItem('color', each.color);
            localStorage.setItem('weight', each.weight);
            localStorage.setItem('image', each.image);

            window.location = 'editForm.html'
        })






        eachImageDiv.appendChild(Image); //appending required div
        buttonDiv.appendChild(button);
        buttonDiv.appendChild(editButton);
        eachDiv.appendChild(eachImageDiv);
        eachDiv.appendChild(titleDiv);
        eachDiv.appendChild(buttonDiv);


        document.querySelector('.container').appendChild(eachDiv);



    }




    const close_button = document.querySelector('.close') //close button
    close_button.addEventListener('click', () => {
        const any = document.querySelector('.modal');
        any.style.display = 'none';
        const modal_content = document.querySelector('.modal-content');
        modal_content.innerHTML = '';
    })



    return receivedJSON;
}