Date.prototype.yyyymmdd= function() {
    let mm = this.getMonth() + 1;
    let dd = this.getDate();

    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('-');
};

Date.prototype.hhmmssms = function() {
    let hh = this.getHours();
    let mm = this.getMinutes();
    let ss = this.getSeconds();
    let ms = this.getMilliseconds();

    if (ms < 10) {
        ms = '00' + ms
    } else if (ms < 100) {
        ms = '0' + ms
    }

    return [(hh>9 ? '' : '0') + hh,
        (mm>9 ? '' : '0') + mm,
        (ss>9 ? '' : '0') + ss,
        ms
    ].join(':');
}

export const Time = Date;

