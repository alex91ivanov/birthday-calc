#! /apps/node/bin/nodejs

console.clear()
// it accepts variables or arguments in the following format
let example = '2017-15T00:00:00.001+00:00/2019-11-15T00:00:00.000+00:00'
let example2start = new Date('2000-02-15T00:02:00.000+00:00');
let example2end = new Date('2001-12-19T00:00:00.101+00:00');
// console.log(process.argv);
console.log(getArgs(process.argv))

function getArgs(args, date1, date2) {
  start = date1
  end = date2
  if (args.length > 1) {
    if (args.length === 3) {
      start = new Date(args[2].split('/')[0]);
      end = new Date(args[2].split('/')[1]);
    } else if (args.length === 4) {
      start = new Date(args[2]);
      if (date2 = 'now')
        end = new Date(Date.now());
      else
        end = new Date(args[3]);
    }
  } else {
    if (!date2) {
      start = new Date(date1.split('/')[0]);
      end = new Date(date1.split('/')[1]);
    } else {
      start = new Date(date1);
      end = new Date(date2);
    }
  }
  t = date(start, end, time, year)
  return gapToISOString(t)
}

function gapToISOString(t) {
  let isoGap = {
    get years() {
      let a = t.yyyy2 - t.yyyy1
      return a.toString().padStart(4, '0');
    },
    get months() {
      function leapYear() {
        if (year % 4 !== 0) {
          return 28;
        } else if (year % 100 !== 0) {
          return 29;
        } else if (year % 400 !== 0) {
          return 28;
        } else {
          return 29;
        }
      }
      // console.log(t)
      let months = 0;
      for (let i of t.yearsArr.flat()) {
        months += i.length;
      }
      return months.toString().padStart(2, '0');
    },
    get days() {
      let count = 0;
      for (let i of t.yearsArr.flat()) {
        count += i[0]
      }

      // console.log(t.rem.dd)
      t.dayCounter = count;
      return t.dayCounter.toString().padStart(2, '0');
    },
    get hours() {
      return t.gap.hh.toString().padStart(2, '0');
    },
    get minutes() {
      return t.gap.mm.toString().padStart(2, '0')
    },
    get seconds() {
      return t.gap.ss.toString().padStart(2, '0')
    },
    get milliseconds() {
      return t.gap.mmm.toString().padStart(3, '0')
    }
  }
  let isoRem = {
    get years() {
      let years = 0;
      return years.toString().padStart(4, '0');
    },
    get months() {
      let months = 0;
      return months.toString().padStart(2, '0');
    },
    get days() {
      let count = 0;
      for (let i of t.yearsArr.flat()) {
        count += i[0];
      }
      let remDay = t.rem.dd * -1;
      let gapDays = +isoGap.days;
      let total = (gapDays + remDay) - t.dayCounter;
      return total.toString().padStart(3, '0');
    },
    get hours() {
      return t.rem.hh.toString().padStart(2, '0');
    },
    get minutes() {
      return t.rem.mm.toString().padStart(2, '0')
    },
    get seconds() {
      return t.rem.ss.toString().padStart(2, '0')
    },
    get milliseconds() {
      return t.rem.mmm.toString().padStart(3, '0')
    }
  }
  let isoGapString = `${isoGap.years}-${isoGap.months}-${isoGap.days}T${isoGap.hours}:${isoGap.minutes}:${isoGap.seconds}:${isoGap.milliseconds}Z`;
  let isoRemString = `${isoRem.years}-${isoRem.months}-${isoRem.days}T${isoRem.hours}:${isoRem.minutes}:${isoRem.seconds}:${isoRem.milliseconds}Z`;
  let message = `
          first date:   ${t.startDate.toISOString().split('T')[0]} ${'T' + t.startDate.toISOString().split('T')[1]}
            end date:   ${t.endDate.toISOString().split('T')[0]} ${'T' + t.endDate.toISOString().split('T')[1]}
                 gap:   ${isoGapString}
left before round up:   ${isoRemString}
`
  return message;
}

function date(startDate, endDate, time, year) {
  let t = {
    startDate: startDate,
    endDate: endDate,
    yyyy1: startDate.getUTCFullYear(),
    mM1: startDate.getUTCMonth(),
    dd1: startDate.getUTCDate(),
    hh1: startDate.getUTCHours() * 1000 * 60 * 60,
    mm1: startDate.getUTCMinutes() * 1000 * 60,
    ss1: startDate.getUTCSeconds() * 1000,
    mmm1: startDate.getUTCMilliseconds(),
    yyyy2: endDate.getUTCFullYear(),
    mM2: endDate.getUTCMonth(),
    dd2: endDate.getUTCDate(),
    hh2: endDate.getUTCHours() * 1000 * 60 * 60,
    mm2: endDate.getUTCMinutes() * 1000 * 60,
    ss2: endDate.getUTCSeconds() * 1000,
    mmm2: endDate.getUTCMilliseconds(),
    gap: {
      total: 0,
      hh: 0,
      mm: 0,
      ss: 0,
      mmm: 0
    },
    rem: {
      dd: 0,
      hh: 0,
      mm: 0,
      ss: 0,
      mmm: 0
    },
    calendar: [
      [31, 'January'],
      [28, 'February'],
      [31, 'March'],
      [30, 'April'],
      [31, 'May'],
      [30, 'June'],
      [31, 'July'],
      [31, 'August'],
      [30, 'September'],
      [31, 'October'],
      [30, 'November'],
      [31, 'December']
    ]
  };
  t = time(t);
  return year(t);
}

function time(t) {
  t.gap.total = (t.mmm2 + t.ss2 + t.mm2 + t.hh2) - (t.mmm1 + t.ss1 + t.mm1 + t.hh1);
  if (t.gap.total < 0) {
    t.gap.total *= -1;
    t.rem.dd -= 1;
  }
  t.gap.mmm = t.gap.total % 1000;
  t.gap.total = (t.gap.total - t.gap.mmm) / 1000;
  t.gap.ss = t.gap.total % 60;
  t.gap.total = (t.gap.total - t.gap.ss) / 60;
  t.gap.mm = t.gap.total % 60;
  t.gap.total = (t.gap.total - t.gap.mm) / 60;
  t.gap.hh = t.gap.total % 24;
  t.gap.total = (t.gap.total - t.gap.hh) / 24;
  let hhSum = t.gap.mmm + t.gap.ss + t.gap.mm;
  let mmSum = t.gap.mmm + t.gap.ss;
  let ssSum = t.gap.mmm;
  switch (0) {
    case hhSum:
      t.rem.hh = (24 - (t.gap.hh % 24)) % 24;
      t.rem.mm = (60 - (t.gap.mm % 60)) % 60;
      t.rem.ss = (60 - (t.gap.ss % 60)) % 60;
      t.rem.mmm = (1000 - (t.gap.mmm % 1000)) % 1000;
      break;
    case mmSum:
      t.rem.hh = (23 - (t.gap.hh % 24)) % 24;
      t.rem.mm = (60 - (t.gap.mm % 60)) % 60;
      t.rem.ss = (60 - (t.gap.ss % 60)) % 60;
      t.rem.mmm = (1000 - (t.gap.mmm % 1000)) % 1000;
      break;
    case ssSum:
      t.rem.hh = (23 - (t.gap.hh % 24)) % 24;
      t.rem.mm = (59 - (t.gap.mm % 60)) % 60;
      t.rem.ss = (60 - (t.gap.ss % 60)) % 60;
      t.rem.mmm = (1000 - (t.gap.mmm % 1000)) % 1000;
      break;
    default:
      t.rem.hh = (23 - (t.gap.hh % 24)) % 24;
      t.rem.mm = (59 - (t.gap.mm % 60)) % 60;
      t.rem.ss = (59 - (t.gap.ss % 60)) % 60;
      t.rem.mmm = (1000 - (t.gap.mmm % 1000)) % 1000;
  }
  return t;
}

function year(t) {
  t.dayCounter = 0;
  t.leapYearCounter = 0;
  t.yearsArr = [];
  t.yearsDetailed = new Map();

  for (let year = t.yyyy1; year <= t.yyyy2; year++) {
    let calendar = [
      [31, 'January'],
      [28, 'February'],
      [31, 'March'],
      [30, 'April'],
      [31, 'May'],
      [30, 'June'],
      [31, 'July'],
      [31, 'August'],
      [30, 'September'],
      [31, 'October'],
      [30, 'November'],
      [31, 'December']
    ];
    if (year % 4 !== 0) {
      calendar[1][0] = 28;
    } else if (year % 100 !== 0) {
      calendar[1][0] = 29;
      t.leapYearCounter += 1;
    } else if (year % 400 !== 0) {
      calendar[1][0] = 28;
    } else {
      calendar[1][0] = 29;
      t.leapYearCounter += 1;
    }

    if (t.yyyy1 === t.yyyy2) {
      calendar = calendar.splice(t.mM1, t.mM2 + 1);
      if (t.mM1 === t.mM2) {
        calendar[t.mM1][0] -= t.dd1;
        t.yearsArr.push(calendar);
        t.yearsDetailed.set(t.yyyy1, calendar);
      } else {
        calendar[t.mM1][0] = calendar[t.mM1][0] - t.dd1;
        calendar[t.mM2][0] = (t.dd2 + t.rem.dd);
        t.yearsArr.push(calendar);
        t.yearsDetailed.set(t.yyyy1, calendar);
      }
    } else {
      if (year === t.yyyy1 || t.yyyy2) {
        if (year === t.yyyy1) {
          calendar[t.mM1][0] = calendar[t.mM1][0] - t.dd1;
          calendar = calendar.slice(t.mM1, calendar.length);
          t.yearsArr.push(calendar);
          t.yearsDetailed.set(year, calendar);
        } else if (year === t.yyyy2) {
          calendar[t.mM2][0] = (t.dd2 + t.rem.dd);
          calendar = calendar.slice(0, t.mM2 + 1);
          t.yearsArr.push(calendar);
          t.yearsDetailed.set(year, calendar);
        } else {
          t.yearsArr.push(calendar);
          t.yearsDetailed.set(year, calendar);
        }
      }
    }


  }
  return t;
}