import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class ConvertCurrencyDto {
    @ApiProperty({description:"the currency you want to convert From",example:'USD'})
    @IsNotEmpty()
    from:string
    @ApiProperty({description:"the currency you want to convert To",example:'EGP'})
    @IsNotEmpty()
    to:string
    @ApiProperty({description:"the amount of currency you want to convert",example:100})
    @IsNotEmpty()
    amount:number
}