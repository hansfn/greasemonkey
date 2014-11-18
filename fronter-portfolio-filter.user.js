// ==UserScript==
// @name        Fronter Portfolio Filter
// @namespace   https://github.com/hansfn/greasemonkey
// @description Enables filtering of portfolio - all passed or not
// @include     https://fronter.com/*/main.phtml
// @version     1.1
// @grant       GM_registerMenuCommand
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

GM_registerMenuCommand("Show everything", showEverything);
GM_registerMenuCommand("Show only approved users", showApprovedUsers);
GM_registerMenuCommand("Show only non-approved users", showNonApprovedUsers);
GM_registerMenuCommand("Show only users with something approved", showUsersWithSomethingApproved);
GM_registerMenuCommand("Hide results", hideResults);
GM_registerMenuCommand("Show results", showResults);

// ==Configuration==

// Strings that is used to determine if something is approved or not ...
var strings = {'not': 'Ikke', 'approved':'Godkjent'};
// Norwegian: "Ikke" = "Not", "Godkjent" = "Approved"

// ==/Configuration==

function showEverything() {
    _showAllUsers();
    showResults();
}

function showNonApprovedUsers() {
    _hideAllUsers();
    _hideNonApprovedUsers(true);  // Really "showNonApprovedUsers"
}

function showApprovedUsers() {
    _showAllUsers();
    _hideNonApprovedUsers();
}

function showUsersWithSomethingApproved() {
    _showAllUsers();
    _hideUsersWithNothingApproved();
}

function _hideNonApprovedUsers(reverse) {
    var mainframe = window.frames[2].frames[1].document;
    $('#results-container table.result-matrix-search-results tbody tr', mainframe).each(function() {
        var results = $(this).find('td.resultmatrix-resultfield');
        if (results) {
            var id = this.id;
            var id_other = this.id.replace('trcol-2-', 'trcol-1-');
            var n = results.length;
            for (var i = 0; i < n; i++) {
                var found = false;
                if (reverse) {
                    // Show users with non-approved exercises
                    if ($(results[i]).find('a').attr('title').indexOf(strings['not']) > -1) {
                        $('#' + id, mainframe).show();
                        $('#' + id_other, mainframe).show();
                        break;
                    }
                } else {
                    if ($(results[i]).find('a').attr('title') != strings['approved']) {
                        $('#' + id, mainframe).hide();
                        $('#' + id_other, mainframe).hide();
                        break;
                    }
                }
            }
        }
    });
}

function _hideUsersWithNothingApproved() {
    var mainframe = window.frames[2].frames[1].document;
    $('#results-container table.result-matrix-search-results tbody tr', mainframe).each(function() {
        var results = $(this).find('td.resultmatrix-resultfield');
        if (results) {
            var id = this.id;
            var id_other = this.id.replace('trcol-2-', 'trcol-1-');
            var n = results.length;
            var hide = true;
            for (var i = 0; i < n; i++) {
                // Don't hide users with something approved.
                if ($(results[i]).find('a').attr('title') == strings['approved']) {
                    hide = false;
                    break;
                }
            }
            if (hide) {
                $('#' + id, mainframe).hide();
                $('#' + id_other, mainframe).hide();
            }
        }
    });
}

function _showAllUsers() {
    var mainframe = window.frames[2].frames[1].document;
    $('#results-container table.result-matrix-search-results tbody tr', mainframe).each(function() {
        $(this).show();
        var id = this.id.replace('trcol-2-', 'trcol-1-');
        $('#' + id, mainframe).show();
    });
}

function _hideAllUsers() {
    var mainframe = window.frames[2].frames[1].document;
    $('#results-container table.result-matrix-search-results tbody tr', mainframe).each(function() {
        $(this).hide();
        var id = this.id.replace('trcol-2-', 'trcol-1-');
        $('#' + id, mainframe).hide();
    });
}

function showResults() {
    var mainframe = window.frames[2].frames[1].document;
    $('#enclosure_div', mainframe).show();
}

function hideResults() {
    var mainframe = window.frames[2].frames[1].document;
    $('#enclosure_div', mainframe).hide();
}
