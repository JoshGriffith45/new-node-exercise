class MockData {
  constructor(id, firstName, lastName, role = null) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this._created = new Date().toString();
  }
}

const PREPOP_DATA = [
  new MockData(1, "Frodo", "Baggins", "admin"),
  new MockData(2, "Sam", "Gamgee", "member"),
  new MockData(3, "Merriadoc", "Brandybuck", "guest"),
  new MockData(4, "Peregrine", "Took", "guest"),
];

class MockDB {
  #data = PREPOP_DATA;
  #nextId = 5;

  /**
   * Asynchronously resets the dataset to the default values.
   */
  async reset() {
    this.#data = PREPOP_DATA;
  }

  /**
   * Checks to see if all of the keys on the given object match the keys expected in MockData.
   * @param {MockData} obj
   * @returns {boolean} a boolean value indicating whether all of the input object's keys are valid keys.
   */
  isValidData(obj) {
    return Object.keys(obj).every((key) =>
      ["id", "firstName", "lastName", "role", "_created"].includes(key)
    );
  }

  /**
   * Asynchronously adds a mock user object to the dataset.
   * @param {MockData} newUserDTO
   * @returns {{ insertedUser: MockData, success: boolean }} an object with two values: insertedRow and success
   */
  async add(newUserDTO) {
    if (this.isValidData(newUserDTO)) {
      let newUser = new MockData(
        this.#nextId++,
        newUserDTO.firstName,
        newUserDTO.lastName,
        newUserDTO.role
      );

      this.#data.push(newUser);

      return {
        insertedRow: newUser,
        success: true,
      };
    } else {
      throw new Error("Invalid column names found");
    }
  }

  /**
   * Asynchronously finds and updates a mock user object by id.
   * @param {number} id
   * @param {MockData} updatedUserDTO
   * @returns {{ updatedUser: MockData, success: boolean }} an object with two values: updatedRow and success
   */
  async update(id, updatedUserDTO) {
    if (this.isValidData(updatedUserDTO)) {
      let updatedUser;

      this.#data = this.#data.map((value) => {
        if (value.id == id) {
          updatedUser = {
            ...value,
            ...updatedUserDTO,
          };
          return updatedUser;
        }

        return value;
      });

      return {
        updatedRow: updatedUser,
        success: true,
      };
    } else {
      throw new Error("Invalid column names found");
    }
  }

  /**
   * Asynchronously finds and returns a mock user object by id.
   * @param id number
   * @returns user object
   */
  async getOne(id) {
    return this.#data.find((value) => value.id == id) || null;
  }

  /**
   * Asynchronously returns a mock data list of user objects.
   * @returns array of users
   */
  async getAll() {
    return this.#data;
  }

  /**
   * Asynchronously finds and removes a mock user object by id.
   * @param {number} id
   * @returns {{ removedRowId: number, success: boolean }} an object with two values: removedRowId and success
   */
  async remove(id) {
    this.#data = this.#data.filter((value) => value.id != id);

    return {
      removedRowId: id,
      success: true,
    };
  }
}

let db = new MockDB();

export default db;
