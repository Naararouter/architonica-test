export function mapReducerChild(array, childFunction, action){
        let result = [];
        for(let i = 0; i < array.length; i++){
            if(!Array.isArray(array[i])) //Костыль от массивов в бэкэнде
                result.push(childFunction(array[i],action));
        }
        return result;
    }
