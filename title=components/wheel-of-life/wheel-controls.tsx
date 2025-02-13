  <div className="flex flex-col">
    <Label htmlFor="dateSelect" className="mb-1">Date</Label>
    <Select onValueChange={onDateSelect} value={selectedDate || undefined}>
      <SelectTrigger id="dateSelect" className="w-[140px] h-12">
        <SelectValue placeholder="Select date"/>
      </SelectTrigger>
      <SelectContent>
        {storedDates.map((date) => (
          <SelectItem key={date} value={date}>
            {date}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  <div className="flex flex-col">
    <Label htmlFor="compareSelect" className="mb-1">Compare with</Label>
    <Select onValueChange={onCompareSelect} value={compareDate || undefined}>
      <SelectTrigger id="compareSelect" className="w-[140px] h-12">
        <SelectValue placeholder="Compare with" />
      </SelectTrigger>
      <SelectContent>
        {storedDates
          .filter((d) => d !== selectedDate)
          .map((date) => (
            <SelectItem key={date} value={date}>
              {date}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  </div> 