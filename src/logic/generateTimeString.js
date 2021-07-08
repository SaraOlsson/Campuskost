export default function generateTimeString(timestamp) {

    let string_result = undefined;
    try {
      let time = timestamp.toDate();
      let months = ['jan', 'feb', 'mars', 'april', 'maj', 'juni', 'juli', 'aug', 'sept', 'okt', 'nov', 'dec'];
      string_result = time.getDate() + ' ' + months[time.getMonth()];
    }
    catch(err) {
      console.log(err.message);
    }
    return string_result;
}