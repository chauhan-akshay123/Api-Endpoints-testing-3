const request = require("supertest");
const {
  app,
  getAllRecipes,
  getRecipeById,
  addRecipe,
} = require("../index.js");

const { afterEach, beforeEach, describe } = require("node:test");

const http = require("http");

jest.mock("../index.js", () => {
  const actualModule = jest.requireActual("../index.js");
  return {
    ...actualModule,
    getAllRecipes: jest.fn(),
    getRecipeById: jest.fn(),
    addRecipe: jest.fn(),
  };
});

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Endpoints Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all recipes", async () => {
    const mockRecipes = [
      { id: 1, name: "Spaghetti Bolognese", cuisine: "Italian", difficulty: "Medium" },
      { id: 2, name: "Chicken Tikka Masala", cuisine: "Indian", difficulty: "Hard" },
    ];

    getAllRecipes.mockResolvedValue(mockRecipes);
    const result = await request(server).get("/recipes");
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockRecipes);
  }, 10000);  // Increase timeout to 10 seconds

  it("should retrieve specific recipe by Id", async () => {
    const mockRecipe = { id: 1, name: "Spaghetti Bolognese", cuisine: "Italian", difficulty: "Medium" };

    getRecipeById.mockResolvedValue(mockRecipe);
    const result = await request(server).get("/recipes/details/1");
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockRecipe);
  }, 10000);

  it("should return 404 for a non-existing recipe", async () => {
    getRecipeById.mockResolvedValue(null);

    const result = await request(server).get("/recipes/details/999");
    expect(result.statusCode).toEqual(404);
  }, 10000);

  it("should add a recipe", async () => {
    const mockRecipe = { id: 3, name: "Momos", cuisine: "Chinese", difficulty: "Easy" };

    addRecipe.mockResolvedValue(mockRecipe);
    const result = await request(server)
      .post("/recipes/new")
      .send({ name: "Momos", cuisine: "Chinese", difficulty: "Easy" });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(mockRecipe);
  }, 10000);
});
