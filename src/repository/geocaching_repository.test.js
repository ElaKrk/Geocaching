const { addGeocacheToDbFile, changeGeocacheInDbFile } = require('./geocaching_repository');
const { readFile, saveToFile } = require('../db/filedb');
const uuidv4 = require('uuid/v4');

jest.mock('../db/filedb');

describe("repository", () => {
    beforeEach(() => {
        saveToFile.mockClear()
    })

    describe("addGeocacheToDbFile()", () => {
        it('appends new record to file', async () => {
            expect.assertions(1);

            readFile.mockReturnValueOnce([{ location: "Rynek", uuid: "foo" }])
            uuidv4.mockReturnValueOnce("bar");
            const newRecord = { location: "Dluga" };

            await addGeocacheToDbFile(newRecord);

            expect(saveToFile.mock.calls[0][0]).toEqual([
                { location: "Dluga", uuid: "bar" },
                { location: "Rynek", uuid: "foo" },

            ])
        })
    })

    describe("changeGeocacheInDbFile()", () => {
        it('changes one record in file', async () => {
            expect.assertions(1);

            const arrayOfGeolocation = readFile.mockReturnValueOnce([{ location: "Rynek", uuid: "foo" }])

            const newRecord = { location: "Dluga" };
            const uuid = "foo";
            await changeGeocacheInDbFile(newRecord, uuid);

            expect(saveToFile.mock.calls[0][0]).toEqual([
                { location: "Dluga", uuid: "foo" },

            ])
        })
        it('handles nonexisting uuid', async () => {
            expect.assertions(1);

            const arrayOfGeolocation = readFile.mockReturnValueOnce([{ location: "Rynek", uuid: "foo" }])

            const newRecord = { location: "Dluga" };
            const uuid = "goo";
            
            try {
                await changeGeocacheInDbFile(newRecord, uuid);
            } catch(e) {
                expect(e.message).toEqual("record does not exist")
            }
        })
    })

})

