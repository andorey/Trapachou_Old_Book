const $$ = (selector) => {
  let items = document.querySelectorAll(selector);
  if (items.length === 1) {
    return document.querySelector(selector)
  }
  else {
    return items
  }
};
const getCoords = (elem) => {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
    bottom: box.bottom + pageYOffset,
    right: box.right + pageXOffset
  };
}
const convertToWords = (number) => {
  let singleDigits = ["один","два","три","четыре","пять","шесть","семь","восемь","девять"];
  let special = ["одинадцать","двенадцать","тринадцать","четырнадцать","пятнадцать","шестнадцать","семнадцать","восемнадцать","девятнадцать"];
  let decades = ["десять", "двадцать","тридцать","сорок","пятьдесят","шестьдесят","семьдесят","восемьдесят","девяносто"];
  let hundreds = ["сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];
  let thousand = ["тысяча", "тысячи", 'тысяч'];

  function convertToString(num) {
  	let result = 1;
  	if (num < 100) {
  		result = handleUnder100(num);
  	}
  	else if (num >= 100 && num < 1000) {
  		result = handleUnder1000(num);
  	}
  	else if (num >= 1000 && num < 10000) {
  		result = handleUnder10000(num);
  	}
  	else if (num >= 10000 && num < 100000) {
  		result = handleUnder100000(num);
  	}
  	else if (num >= 100000 && num < 1000000) {
  		result = handleUnder1000000(num);
  	}
  	else {
  		result = "один миллион"
  	}
  	return result;
  }

  function handleUnder100(num) {
  	if (num < 10) {
      return singleDigits[num-1]
    }
    else if (/(1[1-9])$/.test(num)) {
      return special[num%10-1]
    }
    else if ((num/10 + "").length === 1) {
      return decades[num/10-1]
    }
    else if ((num/10 + "").length > 1) {
      return decades[Math.floor(num/10-1)] + " " + singleDigits[String(num).slice(-1)-1]
    }
  }

  function handleUnder1000(num) {
  	let sliced = String(num).slice(0,1)
  	if ((num/100 + "").length === 1) {
      return hundreds[num/100-1]
    }
    else {
    	return hundreds[sliced-1] + " " + handleUnder100(+String(num).slice(-2))
    }
  }

  function handleUnder10000(num) {
  	let sliced = String(num).slice(0,1)
  	if ((num/1000 + "").length === 1) {
      return changeWord(singleDigits[+sliced-1])+ " " + changeThousands(+sliced, thousand)
    }
    else if (+String(num).slice(-3) < 100) {
    	return changeWord(singleDigits[+sliced-1])+ " " + changeThousands(+sliced, thousand) + " " + handleUnder100(num%1000)
    }
    else {
      return changeWord(singleDigits[+sliced-1])+ " " + changeThousands(+sliced, thousand)+ " " + handleUnder1000(+String(num).slice(-3))
    }
  }

  function handleUnder100000(num) {
  	let sliced = String(num).slice(0,2)
  	if ((num/1000 + "").length === 2) {
    	return changeWord(handleUnder100(+sliced))+ " " + changeThousands(+sliced, thousand)
    }
    else {
    	return changeWord(handleUnder100(+sliced))+ " " + changeThousands(+sliced, thousand) + " " + handleUnder1000(+String(num).slice(-3))
    }
  }

  function handleUnder1000000(num) {
  	let sliced = String(num).slice(0,3)
  	if ((num/1000 + "").length === 3) {
    	return changeWord(handleUnder1000(+sliced))+ " " + changeThousands(+sliced, thousand)
    }
    else {
    	return changeWord(handleUnder1000(+sliced))+ " " + changeThousands(+sliced, thousand) + " " + handleUnder1000(+String(num).slice(-3))
    }
  }

  function changeWord(str) {
  	let result;
    let arr = str.split(' ');
    let strTwo = arr[arr.length-1]
    switch(strTwo) {
    	case "один":
      	result = arr.splice(-1, 1, "одна");
        break;
      case 'два':
      	result = arr.splice(-1, 1, "две");
        break;
      default:
      	result = str;
    }
    return arr.join(' ')
  }

  function changeThousands(num, arr) {
  	let result;
    switch(+String(num).slice(-1)) {
      case 1:
      	result = arr[0];
      break;
      case 2:
      case 3:
      case 4:
      	result = arr[1];
        break
      default:
      	result = arr[2];
    }
    return result
  }

  return convertToString(number)
}
