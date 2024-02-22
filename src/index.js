import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
// 控制台字体颜色控制
import { blue, red, reset, yellow } from "kolorist";
import prompts from "prompts";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2), { string: ["_"] });
const cwd = process.cwd();

const defaultTargetDir = "project";

const renameFiles = {
  _gitignore: ".gitignore",
};

const FRAMEWORKS = [
  {
    name: "vue",
    display: "vue",
    color: yellow,
    variants: [
      {
        name: "vue-ts",
        display: "TypeScript",
        color: blue,
      },
      {
        name: "vue",
        display: "JavaScript",
        color: yellow,
      },
    ],
  },
  {
    name: "react",
    display: "react",
    color: yellow,
    variants: [
      {
        name: "react-ts",
        display: "TypeScript",
        color: blue,
      },
      {
        name: "react",
        display: "JavaScript",
        color: yellow,
      },
    ],
  },
  {
    name: "uniapp",
    display: "uniapp",
    color: yellow,
    variants: [
      {
        name: "uniapp-ts",
        display: "TypeScript",
        color: blue,
      },
      {
        name: "uniapp",
        display: "JavaScript",
        color: yellow,
      },
    ],
  },
];

init();
async function init() {
  console.log(blue("create-7779 start"));
  try {
    // 命令后跟的字符串
    const argTargetDir = formatTargetDir(argv._[0]);
    const argTemplate = argv.template || argv.t;
    // 当前目录
    let targetDir = argTargetDir || defaultTargetDir;
    // 问题
    const response = await prompts([
      {
        type: "text",
        name: "projectName",
        initial: defaultTargetDir,
        message: reset("project name:"),
        onState: (state) => {
          // 监听变化
          targetDir = formatTargetDir(state.value) || defaultTargetDir;
        },
      },
      {
        // 判断目录是否需要覆盖
        type: () =>
          !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "select",
        name: "overwrite",
        message: () =>
          (targetDir === "."
            ? "Current directory"
            : `Target directory "${targetDir}"`) +
          ` is not empty. Please choose how to proceed:`,
        initial: 0,
        choices: [
          {
            title: "Remove existing files and continue",
            value: "yes",
          },
          {
            title: "Cancel operation",
            value: "no",
          },
          {
            title: "Ignore files and continue",
            value: "ignore",
          },
        ],
      },
      {
        type: "select",
        name: "framework",
        message: reset("Select a framework:"),
        choices: FRAMEWORKS.map((framework) => {
          const frameworkColor = framework.color;
          return {
            title: frameworkColor(framework.display || framework.name),
            value: framework,
          };
        }),
      },
      {
        type: "select",
        name: "variant",
        message: reset("Select a variant:"),
        choices: (framework) =>
          framework.variants.map((variant) => {
            const variantColor = variant.color;
            return {
              title: variantColor(variant.display || variant.name),
              value: variant.name,
            };
          }),
      },
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled");
        },
      },
    ]);

    const root = path.join(cwd, targetDir);
    // 判断文件是否存在
    if (response.overwrite === "yes") {
      emptyDir(root);
    } else if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }

    // 确定模板
    let template = response.variant || response.framework?.name || argTemplate;
    // 模板地址
    const templateDir = path.resolve(
      fileURLToPath(import.meta.url),
      "../..",
      `template-${template}`
    );

    const write = (file, content) => {
      const targetPath = path.join(root, renameFiles[file] ?? file);
      if (content) {
        fs.writeFileSync(targetPath, content);
      } else {
        copy(path.join(templateDir, file), targetPath);
      }
    };

    // 复制或者写文件到目标目录
    const files = fs.readdirSync(templateDir);
    for (const file of files) {
      write(file);
    }

    // 输出提示
    console.log(`\nDone. Now run:\n`);
    const cdProjectName = path.relative(cwd, root);
    if (root !== cwd) {
      console.log(
        `  cd ${
          cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
        }`
      );
    }

    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
    const pkgManager = pkgInfo ? pkgInfo.name : "npm";

    switch (pkgManager) {
      case "yarn":
        console.log("  yarn");
        console.log("  yarn dev");
        break;
      default:
        console.log(`  ${pkgManager} install`);
        console.log(`  ${pkgManager} run dev`);
        break;
    }
    console.log();
  } catch (err) {
    console.error(err);
  }
}

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function isEmpty(path) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}
