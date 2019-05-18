import { Injectable } from "@angular/core";


/**
 * Service to perform operations with files thorouhg API
 */
@Injectable()
export class DataService {
    series: DataSeries[]

    constructor() {
        this.series = []
    }

    public parseInputIntoSeries(input: string, delimeter: string): string {
        if (!input){
            return ""
        }
        var lines = input.split('\n')
        var n = 1;
        for (let i = 0; i < lines.length; i++) {
            var line = lines[i];
            var series = new DataSeries
            var sp = line.split(delimeter)
            series.y = sp.map(s => parseFloat(s))
            if (i < lines.length-1 && lines[i+1].length > 0){
                line = lines[i+1]
                sp = line.split(delimeter)
                if (sp.length != series.y.length){
                    return "You have different number of x,y values in series #"+n
                }
                if (sp.every(s => !isNaN(parseFloat(s)))){
                    series.x = sp.map(s => parseFloat(s))
                } else{
                    series.labelsX = sp
                }
                i++ // we have x
            }
            i++ //skip to next line to parse
            while(i < lines.length-1 && lines[i+1].length == 0 ){
                i++
            }
            series.name = this.findNextAvailableName()
            this.series.push(series)
            n++
        }
        console.log(this.series)
   
        return ""
    }
    
    private findNextAvailableName(): string {
        var indices = this.series.filter(s => s.name && s.name.startsWith("series_")).map(s => parseInt(s.name.split("_")[1]))
        indices.push(0) // in case of empty array
        return "series_"+(Math.max(...indices)+1)
    }
}



export class DataSeries {
    name: string
    labelsX: string[]
    x: number[]
    y: number[]
}