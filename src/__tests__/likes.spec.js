const request = require("supertest");
const app = require("../app");

describe("Likes", () => {
  it("should be able to give a like to the repository", async () => {
    const repository = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/Rocketseat/umbriel",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"]
      });

    // console.log("");
    // console.log(`1 -> repository.body.url:   [ ${repository.body.url} ]`);
    // console.log(`1 -> repository.body.title: [ ${repository.body.title} ]`);
    // console.log(`1 -> repository.body.techs: [ ${repository.body.techs} ]`);
    // console.log(`1 -> repository.body.likes: [ ${repository.body.likes} ]`);

    // console.log("");
    // console.log(`2 -> repository.body.id: ${repository.body.id}`);
    // console.log(`3 -> /repositories/${repository.body.id}/like`);
    // console.log(`3 -> response.body.likes: [ ${response.body.likes} ]`);
    
    let response = await request(app).post(
      `/repositories/${repository.body.id}/like`
    );

    // console.log(`4 -> /repositories/${repository.body.id}/like`);
    // console.log(`4 -> response.body.likes: [ ${response.body.likes} ]`);

    expect(response.body).toMatchObject({
      likes: 1
    });

    // console.log(`5 -> /repositories/${repository.body.id}/like`);
    // console.log(`5 -> response.body.likes: [ ${response.body.likes} ]`);

    response = await request(app).post(
      `/repositories/${repository.body.id}/like`
    );

    // console.log(`6 -> /repositories/${repository.body.id}/like`);
    // console.log(`6 -> response.body.likes: [ ${response.body.likes} ]`);

    expect(response.body).toMatchObject({
      likes: 2
    });

    // console.log(`7 -> /repositories/${repository.body.id}/like`);
    // console.log(`7 -> response.body.likes: [ ${response.body.likes} ]`);
    // console.log("");

  });

  it("should not be able to like a repository that does not exist", async () => {
    await request(app)
      .post(`/repositories/123/like`)
      .expect(400);
  });
});
