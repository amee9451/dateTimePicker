(function (jqs) {
    jqs.fn.customDateTimePicker = function (options) {
        try {
            var opts = jqs.extend({}, jqs.fn.customDateTimePicker.defaults, options);
            var selector = this.selector;
            $(selector).css("cursor", "not-allowed");
            var _this = this;
            var arr_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            this.init = function (datetime, flag) {
                console.log(datetime, flag);
                var str_datetime = datetime || "";
                var week_days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
                var n_weekstart = 1;
                var dt_datetime = (str_datetime == null || str_datetime == "" ? new Date() : _this.str2dt(str_datetime));
                var dt_prev_month = new Date(dt_datetime);
                dt_prev_month.setMonth(dt_datetime.getMonth() - 1);
                var dt_next_month = new Date(dt_datetime);
                dt_next_month.setMonth(dt_datetime.getMonth() + 1);
                var dt_firstday = new Date(dt_datetime);
                dt_firstday.setDate(1);
                dt_firstday.setDate(1 - (7 + dt_firstday.getDay() - n_weekstart) % 7);
                var dt_lastday = new Date(dt_next_month);
                dt_lastday.setDate(0);
                var calenderHtml = new String(
                        "<table cellspacing='0' border='0' width='100%'>\n" +
                        "<tr><td bgcolor='#4682B4'>\n" +
                        "<table cellspacing='1' cellpadding='3' border='0' width='100%'>\n" +
                        "<tr>\n	<td bgcolor='#4682B4'><span class='prevMonth' data-value=" + _this.dt2dtstr(dt_prev_month) + ">" +
                        "<b style='color: #ffffff;font-weight: bolder;font-size: 18px;cursor: pointer'><</b></span></td>\n" +
                        "<td bgcolor='#4682B4' colspan='5' align='center'>" +
                        "<div><div class='month' style='display:inline-block;margin-right:5px;color:#fff'><span>" + arr_months[dt_datetime.getMonth()] + "</span><select class='monthSelect' style='display:none;border:1px solid #ccc;width:66px'></select></div><div style='display:inline-block;color:#fff' class='year'><span>" + dt_datetime.getFullYear() + "</span><select class='yearSelect' style='display:none;border:1px solid #ccc'></select></div></div>" +
                        "</td>\n" +
                        "<td bgcolor='#4682B4' align='center'><span class='nextMonth' data-value=" + _this.dt2dtstr(dt_next_month) + ">" +
                        "<b style='color: #ffffff;font-weight: bolder;font-size: 18px;cursor: pointer'>></b></span></td>\n</tr>\n"
                        );
                var dt_current_day = new Date(dt_firstday);
                calenderHtml += "<tr>\n";
                for (var n = 0; n < 7; n++)
                    calenderHtml += "	<td bgcolor='#87CEFA'>" +
                            "<font color='#ffffff' face='tahoma, verdana' size='2'>" +
                            week_days[(n_weekstart + n) % 7] + "</font></td>\n";
                calenderHtml += "</tr>\n";
                while (dt_current_day.getMonth() == dt_datetime.getMonth() ||
                        dt_current_day.getMonth() == dt_firstday.getMonth()) {
                    calenderHtml += "<tr>\n";
                    for (var n_current_wday = 0; n_current_wday < 7; n_current_wday++) {
                        if (dt_current_day.getDate() == dt_datetime.getDate() && dt_current_day.getMonth() == dt_datetime.getMonth()) {
                            calenderHtml += "	<td class='selectedDate' align='center'>";
                        } else if (dt_current_day.getDay() == 0 || dt_current_day.getDay() == 6) {
                            calenderHtml += "	<td class='weekEnd' align='center'>";
                        } else {
                            calenderHtml += "	<td class='weekdays' align='center'>";
                        }
                        if (dt_current_day.getMonth() == dt_datetime.getMonth()) {
                            calenderHtml += "<font class='pickSelectedDate dateAllow' data-value=" + _this.dt2dtstr(dt_current_day) + " size='2'>";
                        } else {
                            calenderHtml += "<font class='pickSelectedDateNot dateDisabled' data-value=" + _this.dt2dtstr(dt_current_day) + "size='2'>";
                        }
                        calenderHtml += dt_current_day.getDate() + "</font></a></td>\n";
                        dt_current_day.setDate(dt_current_day.getDate() + 1);
                    }
                    calenderHtml += "</tr>\n";
                }
                if (opts.showTime) {
                    calenderHtml +=
                            "<form name='cal'>\n<tr><td colspan='7' bgcolor='#87CEFA'>" +
                            "<font color='White' face='tahoma, verdana' size='2'>" +
                            "Time: <input type='text' name='time' value='" + _this.dt2tmstr(dt_datetime) +
                            "' size='8' maxlength='8'></font></td></tr>\n</form>\n" +
                            "</table>\n" +
                            "</tr>\n</td>\n</table>\n";
                } else {
                    calenderHtml += "</table></tr>\n</td>\n</table>\n";
                }
                if (flag) {
                    $(selector).wrap("<div class='datePickerOutter'></div>");
                }
                $(selector).closest('.datePickerOutter').find(".datepicker").remove();
                $(selector).closest('.datePickerOutter').append('<div class="datepicker">' + calenderHtml + '</div>');
                var monthDropDown = $(selector).closest('.datePickerOutter').find(".month select");
                var yearDropDown = $(selector).closest('.datePickerOutter').find(".year select");
                for (var i in arr_months) {
                    monthDropDown.append(new Option(arr_months[i], parseInt(i) + 1));
                }
                for (var i = 1970; i <= ((new Date()).getFullYear()); i++) {
                    yearDropDown.append(new Option(i, i));
                }
            };
            this.str2dt = function (str_datetime) {
                var re_date;
                if (opts.showTime) {
                    re_date = /^(\d+)\-(\d+)\-(\d+)\s+(\d+)\:(\d+)\:(\d+)$/;
                } else {
                    re_date = /^(\d+)\-(\d+)\-(\d+)/;
                }
                if (!re_date.exec(str_datetime)) {
                    return console.log("Invalid Datetime format: " + str_datetime);
                }
                return (new Date(RegExp.$3, RegExp.$2 - 1, RegExp.$1, RegExp.$4, RegExp.$5, RegExp.$6));
            };
            this.dt2dtstr = function (dt_datetime) {
                return (new String(dt_datetime.getDate() + "-" + (dt_datetime.getMonth() + 1) + "-" + dt_datetime.getFullYear() + " "));
            };
            this.dt2tmstr = function (dt_datetime) {
                return (new String(dt_datetime.getHours() + ":" + dt_datetime.getMinutes() + ":" + dt_datetime.getSeconds()));
            };
            jqs(selector).click(function () {
                $(".datePickerOutter .datepicker").hide();
                var _date = $(this).val() || "";
                if ($(this).attr("structure") == "true") {
                    _this.init(_date, false);
                } else {
                    $(this).attr("structure", "true");
                    _this.init(_date, true);
                }
                var ref = jqs(selector).closest(".datePickerOutter");
                ref.delegate(".pickSelectedDate", "click", function () {
                    jqs(selector).val(opts.showTime ? $(this).data('value') + " " + (jqs(selector).closest(".datePickerOutter").find("input[name='time']").val()) || "00:00:00" : $(this).data('value'));
                    $(".selectedDate").addClass("weekdays").removeClass("selectedDate");
                    $(this).parent().addClass('selectedDate');
                    ref.find(".datepicker").hide();
                });
                ref.delegate(".prevMonth", "click", function () {
                    _this.init($(this).data('value'), false);
                });
                ref.delegate(".nextMonth", "click", function () {
                    _this.init($(this).data('value'), false);
                });

                ref.delegate(".month", "click", function () {
                    $(this).find("span").hide();
                    $(this).find("select").show();
                });
                ref.delegate(".year", "click", function () {
                    $(this).find("span").hide();
                    $(this).find("select").show();
                });
                ref.delegate(".monthSelect", "change", function () {
                    var month = $(this).val();
                    $(this).parent().find("span").show().text(month);
                    $(this).hide();
                    var year = ref.find('.year span').text();
                    _this.init((new Date()).getDate() + "-" + month + "-" + year, false);
                });
                ref.delegate(".yearSelect", "change", function () {
                    var year = $(this).val();
                    $(this).parent().find("span").show().text(year);
                    $(this).hide();
                    var month = ref.find('.month span').text();
                    var index = (arr_months.indexOf(month)) + 1;
                    _this.init((new Date()).getDate() + "-" + index + "-" + year, false);
                });
            });
        } catch (e) {
            console.log("fn.customDateTimePicker " + e);
        }
    };
    jqs.fn.customDateTimePicker.defaults = {
        "showTime": false,
        callback: function (e) {
            return e;
        }
    };
})($);

