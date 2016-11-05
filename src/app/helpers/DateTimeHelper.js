export default {
    parseTime(timeInMs){
        let seconds = timeInMs / 1000;
        let secStr = seconds.toString();
        let split = secStr.split('.');
        seconds = split[0];
        let milliseconds = "000";
        if(split[1]){
            milliseconds = split[1];
            while(milliseconds.length < 3){
                milliseconds += '0';
            }
        }

        let times = [], resultMod = -1, resultDiv = -1,
            number = Number(seconds);

        //console.log(number);

        let count = 0;  //---
        while((number >= 60)&&(count < 3)){
            count++;
            //console.log(number);
            resultMod = number % 60;
            if(resultMod < 10){
                resultMod = "0"+resultMod;
            }
            times.push(resultMod);
            number = (number - resultMod) / 60;
        }
        if(times.length < 3){
            times.push(number < 10 ? "0"+number: number);
        }


        let result = '';
        for(let i = 2; i >= 0; i--){
            if(times[i]){
                result += times[i]
            } else {
                result += '00'
            }
            if(i!=0) result += ':'
        }
        result += '.'+milliseconds;

        //console.log(times);

        return result;
    }
};
