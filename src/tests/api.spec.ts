import axios from "axios";

const BASE_URL = "https://bookstore.demoqa.com";
const USERS_ENDPOINT = `${BASE_URL}/Account/v1/User`;
const TOKEN_ENDPOINT = `${BASE_URL}/Account/v1/GenerateToken`;

describe("Bookstore API tests", () => {
  let existingUser = {
    userName: "TestUser",
    password: "TestPass12345!"
  };

  let validUser = {
    userName: "NewUser",
    password: "ValidPass12345!"
  };

  test("Создание пользователя — ошибка (логин уже используется)", async () => {
    try {
      await axios.post(USERS_ENDPOINT, existingUser);
    } catch (error) {
      expect(error.response.status).toBe(406);
      console.log(error.response.status);
      expect(error.response.data.message).toMatch(/User exists!/i);
    }
  });

  test("Создание пользователя — ошибка (пароль не подходит)", async () => {
    try {
      await axios.post(USERS_ENDPOINT, {
        userName: "WeakUser",
        password: "123"
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toMatch(/Password not valid/i);
    }
  });

  test("Создание пользователя — успешно", async () => {
    const response = await axios.post(USERS_ENDPOINT, validUser);
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("userID");
    expect(response.data.username).toBe(validUser.userName);
  });

  test("Генерация токена — ошибка (неверные данные)", async () => {
    try {
      await axios.post(TOKEN_ENDPOINT, {
        userName: "UnknownUser",
        password: "WrongPass"
      });
    } catch (error) {
      expect(error.response.status).toBe(200);
      expect(error.response.data.status).toBe("Failed");
      expect(error.response.data.result).toMatch(/Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer./i);
    }
  });

  test("Генерация токена — успешно", async () => {
    const response = await axios.post(TOKEN_ENDPOINT, validUser);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe("Success");
    expect(response.data.token).toBeDefined();
  });
});