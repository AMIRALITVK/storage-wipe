
const { PowerShell } = require('node-powershell');

const powershellInstance = async () => {
  const ps = new PowerShell({
    debug: true,
    executableOptions: {
      '-ExecutionPolicy': 'Bypass',
      '-NoProfile': true,
    },
  });

  try {
    const message = 'hey from node-powershell <3';
    const printCommand = PowerShell.command`Write-Host ${message} -ForegroundColor red -BackgroundColor white`;
    await ps.invoke(printCommand);

    const scriptCommand = PowerShell.command`. ./script.ps1 -message ${message}`;
    const result = await ps.invoke(scriptCommand);
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await ps.dispose();
  }
};

(async () => {
  console.log('========== playground ==========');
  await powershellInstance();

  console.log(
    await PowerShell.$`echo ${[
      { id: 1, name: 'ran' },
      { id: 2, name: 'cohen' },
    ]}`,
  );

  const message = 'child-shell is awesome';
  await PowerShell.$$`echo ${message}`({ debug: true });

  console.log('========== playground ==========');
})();