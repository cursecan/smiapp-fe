import { Button, Calendar, DateField, DatePicker, Label } from '@heroui/react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { useEffect, useState } from 'react'

const DateInput = ({label, value, onChange=()=>{}, ...props}) => {
    const [dateValue, setDateValue] = useState()

    const changeDateVal = (e) => {
        setDateValue(e)
        onChange(e.toString())
    }


    useEffect(() => {
        if (value) {
            const dt = parseDate(value)            
            setDateValue(dt)
        }
    }, [value])

  return (
    <DatePicker className={'w-50'} name='date' value={dateValue} onChange={changeDateVal}>
        <Label>{label}</Label>
        <DateField.Group>
            <DateField.Input>
                {(segmen) => <DateField.Segment segment={segmen} />}
            </DateField.Input>
            <DateField.Suffix>
                <DatePicker.Trigger>
                    <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
            </DateField.Suffix>
        </DateField.Group>
        <DatePicker.Popover>
          <Calendar aria-label="Event date">
            <Calendar.Header>
              <Calendar.YearPickerTrigger>
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator />
              </Calendar.YearPickerTrigger>
              <Calendar.NavButton slot="previous" />
              <Calendar.NavButton slot="next" />
            </Calendar.Header>
            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
            </Calendar.Grid>
            <Calendar.YearPickerGrid>
              <Calendar.YearPickerGridBody>
                {({year}) => <Calendar.YearPickerCell year={year} />}
              </Calendar.YearPickerGridBody>
            </Calendar.YearPickerGrid>
          </Calendar>
        </DatePicker.Popover>
        <div className="flex justify-end items-center gap-2 mt-1">
            {/* <Button size='sm' variant='secondary' onPress={() => setDateValue(today(getLocalTimeZone()))}>Set Today</Button> */}
            <Button size='sm' variant='secondary' onPress={() => setDateValue(null)}>Clear</Button>
        </div>
    </DatePicker>
  )
}

export default DateInput