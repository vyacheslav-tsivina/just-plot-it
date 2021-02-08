import { Injectable } from "@angular/core";


/**
 * Service to perform operations with files thorouhg API
 */
@Injectable()
export class DataService {
    series: DataSeries[]
    series_id_counter: number
    figures: DataSeries[][]


    constructor() {
        this.series = []
        this.figures = []
        this.series_id_counter = 0
    }

    public parseInputIntoSeries(input: string, delimeter: string): string {
        if (!input){
            return ""
        }
        var lines = input.split('\n')
        var n = 1
        var start = 0
        while(start < lines.length-1 && lines[start].length == 0 ){
            start++
        }
        for (let i = start; i < lines.length; i++) {
            var line = lines[i];
            var series = new DataSeries
            var sp = line.split(delimeter)
            series.y = sp.map(s => parseFloat(s))
            if (i < lines.length-1 && lines[i+1].length > 0){
                line = lines[i+1]
                sp = line.split(delimeter)
                if (sp.length != series.y.length){
                    return "You have different number of x,y values in series #"+n+" #x="+sp.length+" #y="+series.y.length
                }
                if (sp.every(s => !isNaN(parseFloat(s)))){
                    series.x = sp.map(s => parseFloat(s))
                } else{
                    if (sp[0][0] == '_'){
                        sp[0] = sp[0].slice(1)
                    }
                    series.labelsX = sp
                }
                i++ // we have x
            }
            i++ //skip to next line to parse
            while(i < lines.length-1 && lines[i+1].length == 0 ){
                i++
            }
            series.name = this.findNextAvailableName()
            series.type = this.defineType(series)
            if (series.type == DataSeriesType.VALUES){
                series.labelsX = Array.from({ length: series.y.length }, (v, k) => (k + 1).toString())
            }
            
            series.id = this.series_id_counter++
            this.series.push(series)
            n++
        }
   
        return ""
    }
    
    private findNextAvailableName(): string {
        var indices = this.series.filter(s => s.name && s.name.startsWith("series_")).map(s => parseInt(s.name.split("_")[1]))
        indices.push(0) // in case of empty array
        return "series_"+(Math.max(...indices)+1)
    }

    /**
     * Defines the type of DataSeries, to check compatibility for example
     * @param series input series
     */
    private defineType(series: DataSeries): DataSeriesType {
        if (series.x) {
            return DataSeriesType.XY
        }
        if (series.labelsX) {
            return DataSeriesType.CATEGORIES
        }
        return DataSeriesType.VALUES
    }
}



export class DataSeries {
    id: number
    name: string
    labelsX: string[]
    x: number[]
    y: number[]
    type: DataSeriesType
}

export enum DataSeriesType{
    XY = 'x/y',
    CATEGORIES = 'categories',
    VALUES = 'values'
}