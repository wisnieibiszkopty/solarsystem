/////////////
// TO DO
// Walidacja formularzy w js
// Napraw skrypty
// Gwiazdki dodaj
// Walidacja na w3s
/////////////

window.onload = function(){
    const filename = 'json/planet0.json';
    displayJSONData(filename);
}

$(document).ready(function(){
    // Hide and show content of website
    $('.hide-and-show').click(function(){
        $('.container-fluid').toggle();
        changeIcon();
    });

    $('.carousel-control-prev').click(changePlanetInformation);
    $('.carousel-control-next').click(changePlanetInformation);

    $('#reviews-tab').click(function(){
        $('#planets-details').css("display","none");
        addOpinions();
    })

    $('#detail-tab').click(function(){
        $('#planets-details').css("display","flex");
    })

    // change range value
    $(document).on('input', '#distance', function(){
        $('#distance-val').html($(this).val());
    })

    // Saving data of registrated star
    $('#submit-star-reg').click(function(){
       let star = {};
       const name = $('#star').val();
       const owner = $('#owner').val();
       const type = $('#star-type').val();
       let have_planets;
       if($('#yes').is(':checked')){
           have_planets = "tak";
       } else have_planets = "nie";
       const distance = $('#distance').val();

       star.name = name;
       star.owner = owner;
       star.type = type;
       star.have_planets = have_planets;
       star.distance = distance;


       let stars = JSON.parse(localStorage.getItem("stars"));
       if(stars === null) stars = [];
       stars.push(star);
       localStorage.setItem("stars", JSON.stringify(stars));
    });

    $('#show-stars').click(function(){
        let div = $('#star-list');
        if(div.is(':empty')){
            showStars();
            div.fadeIn();
        } else{
            div.empty();
        }
    });

    $('.grid-img').click(function(){
        $('.grid-img').each(function(){
            if($(this).hasClass('grid-active')){
                $(this).removeClass('grid-active');
            }
        })
        $(this).addClass('grid-active');
    })

    $('#post-opinion').click(function(){
        let planet;
        $('.grid-img').each(function(){
            if($(this).hasClass('grid-active')){
                planet = $(this).attr('alt');
            }
        })

        const name = $('#name').val();
        const email = $("#email").val();
        const rating = $("#rating").val();
        const opinion = $("#opinion").val();

        let planet_review = {};
        planet_review.planet = planet;
        planet_review.name = name;
        planet_review.email = email;
        planet_review.rating = rating;
        planet_review.opinion = opinion;

        let opinions = JSON.parse(localStorage.getItem("opinions"));
        if(opinions === null) opinions = [];
        opinions.push(planet_review);
        localStorage.setItem("opinions",JSON.stringify(opinions));

        alert("Udało się poprawnie dodać opinię o planecie");
    })

    $('#collapse1').click(function(){changeArrow(1)});
    $('#collapse2').click(function(){changeArrow(2)});
    $('#collapse3').click(function(){changeArrow(3)});

})

function changePlanetInformation(){
    let n;
    $('.car-item').each(function(){
       if($(this).hasClass("active")){
           n = $(this).attr("data-bs-slide-to");
           let filename = "json/planet" + n + ".json";
           displayJSONData(filename);
           return false;
       }
    });
}

function displayJSONData(filename){
    loadJSON(filename)
        .then(data => {
            if (data !== null) {
                $('#planet-name').html(data.name);
                $('#planet-description').html(data.description);
                $('#type').html(data.type);
                $('#mass').html(data.mass);
                $('#radius').html(data.radius);
                $('#surface-area').html(data.surface_area);
                $('#measurment').html(data.measurment);
                $('#density').html(data.density);
                $('#trading-period').html(data.trading_period);
                $('#rotation-speed').html(data.rotation_speed);
                $('#accelerate').html(data.a);
                $('#escape-velocity').html(data.escape_velocity);
                $('#temperature').html(data.temperature);
            }
        });
}

function loadJSON(filename) {
    return fetch(filename)
        .then(response => {
            if (!response.ok) {
                throw new Error('Wystąpił błąd podczas wczytywania pliku JSON.');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Wystąpił błąd podczas wczytywania pliku JSON:', error);
            return null;
        });
}

function changeIcon(){
    let element = document.getElementById("hide-and-show-icon");
    if(element.className === "bi bi-dash-square-fill"){
        element.className = "bi bi-plus-square-fill";
    }   else element.className = "bi bi-dash-square-fill";
}

function changeArrow(id){
    let name = 'icon' + id;
    let element = document.getElementById(name);
    if(element.className === "bi bi-arrow-down-short"){
        element.className = "bi bi-arrow-up-short";
    }   else element.className = "bi bi-arrow-down-short";
}

function showStars(){
    document.getElementById('star-list').innerHTML = "";
    let stars_list = document.getElementById('star-list');

    let stars = JSON.parse(localStorage.getItem("stars"));
    if(stars === null){
        stars_list.innerHTML += "<h4>Nie zajerestrowano jeszcze żadnych gwiazd</h4>";
    } else {

        let div = document.createElement('div');
        div.classList.add("scroll-container");
        let table = document.createElement('table');

        table.classList.add('table');
        table.classList.add('table-dark');
        table.classList.add('table-hover');
        table.classList.add('scroll');

        table.innerHTML += "<thead></thead><tr><th>Nazwa</th><th>Właściciel" +
            "</th><th>Typ</th><th>Planety</th>" +
            "<th>Odległość od Słońca</th><th></th><th>Usuń</th></tr></thead><tbody>";

        let i, j, values, a;
        for (i = 0; i < stars.length; i++) {
            values = [stars[i].name, stars[i].owner, stars[i].type, stars[i].have_planets, stars[i].distance];

            let tr = document.createElement('tr');
            for (j = 0; j < 7; j++) {
                tr.appendChild(document.createElement('td'));
            }
            tr.cells[0].appendChild(document.createTextNode(values[0]));
            tr.cells[1].appendChild(document.createTextNode(values[1]));
            tr.cells[2].appendChild(document.createTextNode(values[2]));
            tr.cells[3].appendChild(document.createTextNode(values[3]));
            tr.cells[4].appendChild(document.createTextNode(values[4]));
            a = document.createElement('a');
            a.innerHTML = "Edytuj";
            tr.cells[5].appendChild(a);
            a = document.createElement('a');
            a.classList.add('star-delete');
            a.setAttribute("onclick", "deleteStar(" + i + ")");
            a.innerHTML += "<i class='bi bi-x'></i>";
            tr.cells[6].appendChild(a);

            table.appendChild(tr);
        }
        table.innerHTML += '</tbody>';
        div.appendChild(table);
        stars_list.appendChild(div);

        let delete_all = document.createElement("a");
        delete_all.setAttribute('id', 'delete_all');
        delete_all.innerHTML += "Usuń wszystkie elementy listy";
        delete_all.addEventListener('click', function () {
            if (confirm("Czy na pewno chcesz usunąć wszystkie zajerestrowane gwiazdy?")) {
                localStorage.removeItem("stars");
                showStars();
            }
        })
        stars_list.appendChild(delete_all);
        stars_list.style.display = "none";
    }
}

function deleteStar(i){
    let stars = JSON.parse(localStorage.getItem("stars"));
    stars.splice(i,1);
    localStorage.setItem("stars",JSON.stringify(stars));
    showStars();
}

function addOpinions(){
    document.getElementById('planets-reviews').innerHTML = "";
    let opinions = JSON.parse(localStorage.getItem("opinions"));
    if(opinions === null){
        $("#planets-reviews")
            .html("<div class='center-header'><h4>Nie pojawiły się jeszcze żadne opinie</h4></div>");
    } else{
        console.log(opinions);
        let element = document.getElementById("planets-reviews");
        let i, opinion;
        for(i=0;i<opinions.length;i++){
            opinion = document.createElement("div");
            opinion.innerHTML += "<div class='opinion-panel'>" +
                "<div class='opinion-content'>" +
                "<div class='opinion-data'>" +
                    "<div class='opinion-owner'>" +
                        "<div class='opinion-name'>" + opinions[i].name + "</div>" +
                        "<div class='opinion-email'>" + opinions[i].email + "</div>" +
                    "</div>" +
                    "<div class='opinion-rating'>ocenił(a) " + opinions[i].planet + " na " + opinions[i].rating + "/5</div>" +
                "</div>" +
                "<div class='opinion-text'>" + opinions[i].opinion + "</div>" +
                "</div><div class='delete-opinion'><a onclick='deleteOpinion(" + i +")'><i class='bi bi-x'></a></i></div>" +
                "</div>";
            element.appendChild(opinion);
        }
    }
}

function deleteOpinion(i){
    let opinions = JSON.parse(localStorage.getItem("opinions"));
    opinions.splice(i,1);
    localStorage.setItem("opinions",JSON.stringify(opinions));
    addOpinions();
}

function chechInput(id,regex) {
    let input = document.getElementById(id);
    return regex.test(input.value);
}

function checkRadio(radio_name){
    let input=document.getElementsByName(radio_name);
    let chosen;
    for (let i=0;i<input.length;i++) {
        chosen=input[i].checked;
        if (chosen) return true;
    }
    return false;
}
function checkCheckbox(checkbox_id){
    let input=document.getElementById(checkbox_id);
    return input.checked;
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry);
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        } else{
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));
