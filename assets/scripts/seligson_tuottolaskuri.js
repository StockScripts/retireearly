/**
 * Seligson.fi profit counter (tuottolaskuri)
 *
 * Requires jQuery (version 1.3.2 used with development)
 * and jQuery UI Slider (version 1.7.2 used with development)
 */

// decimals (if other than 1)
var decimals = new Object();
decimals["cFeesInput"] = 2;
decimals["cFeesCompare"] = 2;

// init goal counter
$(document).ready(function(){
    // check that jQuery is loaded
    if (!jQuery) { return; }

    // show counter form and result area and hide noscript text
    $("#cForm").show();
    $("#cResult").show();
    $("#cForm_noscript").hide();

    // add return slider
    $("#cReturnSlider").slider({
        min: 0,
        max: 15,
        step: 0.5,
        value: 0,
        slide: function(event, ui) { updateReturnValue(ui.value); },
        change: function(event, ui) { updateReturnRadio(ui.value); }
    });

    // add time slider (with default value of 20)
    $("#cTimeSlider").slider({
        min: 1,
        max: 40,
        value: 20,
        slide: function(event, ui) { updateTimeValue(ui.value); }
    });
    updateTimeValue(20);

    // init all form inputs i.e. set default value and add event listeners
    $("#cInvestment").val(0).change(validateThis);
    $("#cMonthlySaving").val(0).change(validateThis);

    $("#cReturnStoreValue").val(0);
    $("input[type=radio].cReturn").attr("checked", "").click(updateReturnFromRadio);

    $("#cFeesSelect").val(0).change(updateFeesValue);
    $("#cFeesInput").val(0).change(validateThis).change(updateFeesSelect);

    $("#cFeesCompare").val(0).change(validateThis);

    $("#cFormCalculate").click(updateCounterResult);

    $("#cResultReturnCompareMarket").click(updateCounterResult);
    $("#cResultReturnCompareCompetitor").click(updateCounterResult);
});

// update time value (show and store)
function updateTimeValue(value)
{
    // update value shown to user
    $("#cTimeShowValue").text(getYearsText(value));

    // update stored value (used in calculations)
    $("#cTimeStoreValue").val(value);
}

// update return value from radio button
function updateReturnFromRadio()
{
    updateReturnValue(this.value);
    updateReturnSlider(this.value);
}

// update return value in slider
function updateReturnSlider(value)
{
    $("#cReturnSlider").slider('value', value);
}

// update return value in radio buttons
function updateReturnRadio(value)
{
    $("input[type=radio].cReturn").each(function(i) {
        if (this.value == value)
            $(this).attr("checked", "checked");
        else
            $(this).attr("checked", "");
    });
}

// update return value (show and store)
function updateReturnValue(value)
{
    // update value shown to user
    $("#cReturnShowValue").text(showNumber(value, 1));

    // update stored value (used in calculations)
    $("#cReturnStoreValue").val(value);
}

// update fees input box value
function updateFeesValue()
{
    $("#cFeesInput").val(showNumber(this.value, decimals["cFeesInput"]));
}

// update fees dropdown if value changed
function updateFeesSelect()
{
    if (checkNumber(this.value) != checkNumber($("#cFeesSelect").val()))
        $("#cFeesSelect").val(0);
}

// calculate new result and update to page
function updateCounterResult()
{
    // color settings
    fund_color = '#336658'; // seligson fund
    market_color = '#F48532'; // compare to market profit
    compare_color = '#BDBDA5'; // compare to other/competitor

    // null result values (get rid of data from previous calculations)
    $('#cResultEndAmount').text('0');
    $('#cResultEndProfit').text('0');


    $('#cResultCosts').text('0');
    $('#cResultCostsCompare').text('0');
    $('#cResultCostsSavings').text('0');

    // hide legend & graphs
    $("#cResultReturnGraphLegend").css('visibility', 'hidden');
    $("#cResultReturnGraph").html('');
    $("#cResultFeesGraph").html('');

    // validate all fields
    if (!validateAll(['cInvestment', 'cMonthlySaving', 'cTimeStoreValue', 'cReturnStoreValue', 'cFeesInput', 'cFeesCompare']))
        return false;

    // get variable values needed for the calculation
    years = $("#cTimeStoreValue").val();

    fund_fees = checkNumber($("#cFeesInput").val());
    compare_fees = checkNumber($("#cFeesCompare").val());
    market_profit = checkNumber($("#cReturnStoreValue").val());
    fund_profit = market_profit - fund_fees;
    compare_profit = market_profit - compare_fees;

    investment = checkNumber($("#cInvestment").val());

    monthly_saving = checkNumber($("#cMonthlySaving").val());

    // begin profit calculations
    var fund_result = investment;
    var fund_profit_chart = new Array();
    var market_result = investment;
    var market_profit_chart = new Array();
    var compare_result = investment;
    var compare_profit_chart = new Array();

    // calculate monthly profits if we have monthly saving
    if (monthly_saving > 0) {
        fund_monthly_profit = Math.pow(1 + (fund_profit / 100), (1 / 12)) - 1;
        market_monthly_profit = Math.pow(1 + (market_profit / 100), (1 / 12)) - 1;
        compare_monthly_profit = Math.pow(1 + (compare_profit / 100), (1 / 12)) - 1;
    }

    // iterate through years
    for (i = 0; i < years; i++) {
        // if we have monthly saving
        if (monthly_saving > 0) {
            // iterate through months
            for (j = 0; j < 12; j++) {
                // add monthly saving
                fund_result += monthly_saving;
                market_result += monthly_saving;
                compare_result += monthly_saving;

                // add profit
                fund_result = (1 + fund_monthly_profit) * fund_result;
                market_result = (1 + market_monthly_profit) * market_result;
                compare_result = (1 + compare_monthly_profit) * compare_result;
            }
        }
        // else no monthly saving
        else {
            // add yearly profit
            fund_result = (1 + fund_profit / 100) * fund_result;
            market_result = (1 + market_profit / 100) * market_result;
            compare_result = (1 + compare_profit / 100) * compare_result;
        }

        // save this years results for graph
        fund_profit_chart[i] = roundNumber(fund_result);
        market_profit_chart[i] = roundNumber(market_result);
        compare_profit_chart[i] = roundNumber(compare_result);
    }

    // get labels
    year_label = getText("year", "Vuosi");
    wealth_label = getText("wealth", "Varallisuus");

    // create profit chart data
    chart_data = "<chart>";
    chart_data += "<series>";
    for (i = 0; i < years; i++) {
        chart_data += "<value xid='"+i+"'>"+(i+1)+"</value>";
    }
    chart_data += "</series>";
    chart_data += "<graphs>";
    chart_data += "<graph gid='1'>";
    for (i = 0; i < fund_profit_chart.length; i++) {
        description = year_label+": "+i+" "+wealth_label+": "+fund_profit_chart[i]+" €";
        chart_data += "<value xid='"+i+"' color='"+fund_color+"' description='"+description+"'>"+fund_profit_chart[i]+"</value>";
    }
    chart_data += "</graph>";

    // compare to market profit
    if ($('#cResultReturnCompareMarket').attr('checked')) {
        chart_data += "<graph gid='2'>";
        for (i = 0; i < market_profit_chart.length; i++) {
            description = year_label+": "+i+" "+wealth_label+": "+market_profit_chart[i]+" €";
            chart_data += "<value xid='"+i+"' color='"+market_color+"' description='"+description+"'>"+market_profit_chart[i]+"</value>";
        }
        chart_data += "</graph>";
    }

    // compare to other fund
    if ($('#cResultReturnCompareCompetitor').attr('checked')) {
        chart_data += "<graph gid='3'>";
        for (i = 0; i < compare_profit_chart.length; i++) {
            description = year_label+": "+i+" "+wealth_label+": "+compare_profit_chart[i]+" €";
            chart_data += "<value xid='"+i+"' color='"+compare_color+"' description='"+description+"'>"+compare_profit_chart[i]+"</value>";
        }
        chart_data += "</graph>";
    }

    chart_data += "</graphs>";
    chart_data += "</chart>";

    // set result values shown to user
    $('#cResultEndAmount').text(showNumber(fund_result, 0));
    $('#cResultEndProfit').text(showNumber(fund_result - investment - (12 * years * monthly_saving), 0));

    // display graphs legend
    $("#cResultReturnGraphLegend").css('visibility', 'visible');

    // display result graph
    var so1 = new SWFObject("/laskurit/amcolumn/amcolumn.swf", "amcolumn", "330", "180", "8", "#FFFFFF");
    so1.addVariable("path", "/laskurit/amcolumn/");
    so1.addVariable("settings_file", encodeURIComponent("/laskurit/amcolumn/oletustuotto_settings.xml"));
    so1.addVariable("chart_data", chart_data);
    so1.addVariable("preloader_color", "#999999");
    so1.write("cResultReturnGraph");


    // costs calculations
    fund_costs = roundNumber(market_result - fund_result);
    compare_costs = roundNumber(market_result - compare_result);

    // get competitor label
    competitor_label = getText("competitor", "Kilpaileva");

    // create costs chart data
    chart_data = "<chart>";
    chart_data += "<series>";
    chart_data += "<value xid='0'>Seligson</value>";
    chart_data += "<value xid='1'>"+competitor_label+"</value>";
    chart_data += "</series>";
    chart_data += "<graphs>";
    chart_data += "<graph gid='1'>";
    chart_data += "<value xid='0' color='"+fund_color+"' description='"+fund_costs+" €'>"+fund_costs+"</value>";

    // compare to other fund (if fees set for it)
    if (compare_fees > 0) {
        chart_data += "<value xid='1' color='"+compare_color+"' description='"+compare_costs+" €'>"+compare_costs+"</value>";
    }

    chart_data += "</graph>";
    chart_data += "</graphs>";
    chart_data += "</chart>";

    // set result values shown to user
    $('#cResultCosts').text(showNumber(fund_costs, 0));
    $('#cResultCostsCompare').text(showNumber(compare_costs, 0));
    $('#cResultCostsSavings').text(showNumber(compare_costs - fund_costs, 0));

    // display result graph
    var so2 = new SWFObject("/laskurit/amcolumn/amcolumn.swf", "amcolumn", "180", "180", "8", "#FFFFFF");
    so2.addVariable("path", "/laskurit/amcolumn/");
    so2.addVariable("settings_file", encodeURIComponent("/laskurit/amcolumn/kustannukset_settings.xml"));
    so2.addVariable("chart_data", chart_data);
    so2.addVariable("preloader_color", "#999999");
    so2.write("cResultFeesGraph");

    // focus on our dummy focus handle link so result area becomes visible
    $("#cResultFocusHandle").focus();
}
