// Creiamo un calendario dinamico con le festività.
// Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).

// Milestone 1
// Creiamo il mese di Gennaio e con la chiamata all'API inseriamo le festività.

// Milestone 2
// Diamo la possibilità di cambiare mese, gestendo il caso in cui l’API non possa ritornare festività.

// Attenzione!
// Ogni volta che cambio mese dovrò:
// - Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018)
// - Controllare quanti giorni ha il mese scelto formando così una lista
// - Chiedere all’API quali sono le festività per il mese scelto
// - Evidenziare le festività nella lista

$(document).ready(function () {
    // Impostazione del moment locale
    moment.locale('it');
    // Seleziono il mese di gennaio 2018
    var currentDate = moment('2018-01-01');

    // Invoco le funzioni che creano i giorni del mese ed evidenziano le festività
    insertDays(currentDate);
    insertHolidays(currentDate);

    // Premendo il tasto 'prev' visualizzo il mese precedente (anno fissato)
    $('#prev').click(function () {
        if (currentDate.get('month') == 0) {
            alert('Nessun mese da visualizzare');
        } else {
            var newDate = currentDate.subtract(1, 'months');
            $('li').remove();
            insertDays(newDate);
            insertHolidays(newDate);
        }
    });

    // Premendo il tasto 'next' visualizzo il mese successivo (anno fissato)
    $('#next').click(function () {
        if (currentDate.get('month') == 11) {
            alert('Nessun mese da visualizzare');
        } else {
            var newDate = currentDate.add(1, 'months');
            $('li').remove();
            insertDays(newDate);
            insertHolidays(newDate);
        }
    });
});

// *** FUNCTIONS *** //
// Generazione dei giorni del mese
function insertDays(data) {
    // Appendo 'mese + anno' nell'intestazione
    var month = data.format('MMMM');
    var year = data.format('YYYY');
    $('h1.month').html(`${capitalize(month)} ${year}`);

    var daysMonth = data.daysInMonth();

    // Uso Handlebars per generare i giorni del mese
    for (var i = 1; i <= daysMonth; i++) {
        var source = $('#day-template').html();
        var template = Handlebars.compile(source);

        var context = {
            day: addZero(i),
            month: month,
            // Qui il 'this' va usato all'interno di una function: attribuendo il metodo come proprietà all'oggetto, 'this' si riferisce al proprietario del metodo (l'oggetto 'context'), altrimenti senza function 'this' si riferisce all'oggetto globale (window)
            fullDate: function () {
                return `${year}-${data.format('MM')}-${this.day}`;
            }
        };

        var html = template(context);
        $('.month-list').append(html);
    }
}


// Chiamata AJAX per evidenziare le festività
function insertHolidays(data) {
    $.ajax(
        {
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            // 'data' contiene le chiavi necessarie al caricamento corretto dell'API (le aggiunge all'url...)
            data: {
                year: data.year(),
                month: data.month()
            },
            success: function (obj) {
                var holidays = obj.response;
                for (var i = 0; i < holidays.length; i++) {
                    var listItem = $(`li[data-full-date="${holidays[i].date}"]`);
                    listItem.append(` - ${holidays[i].name}`);
                    listItem.addClass('holiday');
                }
                // each
            },
            error: function () {
                alert('Errore');
            }
        }
    );
}

// Aggiunta di uno zero davanti ai numeri < 10
function addZero(n) {
    return n < 10 ? `0${n}` : n;
}

// Primo carattere di una stringa in maiuscolo
function capitalize(str) {
    var firstChar = str.charAt(0).toUpperCase();
    return firstChar + str.slice(1).toLowerCase();
}