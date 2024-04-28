import LinkButton from "@/components/link-button";

const StartingPage = () => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-6xl font-bold">TESTOWNIK TURBO</h1>
            <p className="text-balance text-muted-foreground">
              Wznieś swoją naukę na wyżyny i osiągaj sukces!
            </p>
          </div>
          <div className="grid gap-8 mt-4">
            <LinkButton />
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="..\..\public\pexels-elijahsad-7711126.jpg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default StartingPage;
