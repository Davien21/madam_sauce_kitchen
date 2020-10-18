const { validateMeal, sortByDays } = require('../../../models/meal')

describe('sortByDays function', () => {
  it('should sort meals according to days of the week', () => {
    const meals = [
      { name: 'banga', day: 'thursday' },
      { name: 'banga', day: 'monday' },
      { name: 'jellof', day: 'sunday' },
      { name: 'jellof', day: 'friday' },
      { name: 'jellof', day: 'wednesday' },
      { name: 'banga', day: 'tuesday' },
      { name: 'banga', day: 'saturday' },
      { name: 'banga', day: 'monday' },
    ]
    const sortedMeals = sortByDays(meals)
    expect(sortedMeals).toEqual(
      expect.arrayContaining([
        { name: 'banga', day: 'monday' },
        { name: 'banga', day: 'monday' },
        { name: 'banga', day: 'tuesday' },
        { name: 'jellof', day: 'wednesday' },
        { name: 'banga', day: 'thursday' },
        { name: 'jellof', day: 'friday' },
        { name: 'banga', day: 'saturday' },
        { name: 'jellof', day: 'sunday' },
      ])
    )
  })
})
